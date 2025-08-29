use crate::storage::EVENTS;
use crate::types::error::Error;
use crate::types::event::{CreateEventInput, Event, EventStatus, EventUpdate};
use crate::types::filter::CostFilter;
use crate::types::filter::EventFilter;
use crate::types::notification::{NewNotification, NotificationType};
use crate::types::response::seconds_to_nanoseconds;
use crate::utils::{add_notification, generate_unique_id, get_city};
use candid::Principal;
use ic_cdk::api::time;

impl Event {
    pub async fn new(input: CreateEventInput) -> Result<Event, Error> {
        let caller = ic_cdk::api::msg_caller();

        // Validate input data
        if input.title.trim().is_empty() {
            return Err(Error {
                code: 400,
                error: "Title is required".to_string(),
                message: "Event title cannot be empty".to_string(),
            });
        }

        if input.location.description.trim().is_empty() {
            return Err(Error {
                code: 400,
                error: "Location description is required".to_string(),
                message: "Event location description cannot be empty".to_string(),
            });
        }

        // Validate Location city and governorate using inter canister call
        let city_data = get_city(
            input.location.city.clone(),
            input.location.governorate.clone(),
        )
        .await;

        if let Err(e) = city_data {
            return Err(e);
        }

        // Convert frontend seconds to nanoseconds for comparison
        let event_date_nanos = seconds_to_nanoseconds(input.event_date);
        if event_date_nanos <= time() {
            return Err(Error {
                code: 400,
                error: "Invalid event date".to_string(),
                message: "Event date must be in the future".to_string(),
            });
        }

        // Use random ID using raw_rand
        let event_id = generate_unique_id().await;

        let now = time();
        let new_event = Event {
            id: event_id,
            creator_id: caller,
            title: input.title,
            description: input.description,
            event_date: event_date_nanos,
            duration_hours: input.duration_hours,
            location: input.location,
            sport: input.sport,
            max_participants: input.max_participants,
            participants: vec![], // Creator is not added to participants
            status: EventStatus::Upcoming,
            images: input.images,
            cost_per_person: input.cost_per_person,
            requirements: input.requirements,
            created_at: now,
            updated_at: now,
        };

        EVENTS.with(|events| {
            events.borrow_mut().insert(event_id, new_event.clone());
        });

        Ok(new_event)
    }

    pub fn get_by_id(event_id: u64) -> Option<Event> {
        EVENTS.with(|events| events.borrow().get(&event_id))
    }

    pub fn update(event_id: u64, updated_data: EventUpdate) -> Result<(), Error> {
        let caller = ic_cdk::api::msg_caller();

        EVENTS.with(|events| {
            let mut events_map = events.borrow_mut();

            if let Some(mut event) = events_map.get(&event_id) {
                // Check if caller is the creator
                if event.creator_id != caller {
                    return Err(Error {
                        code: 403,
                        error: "Forbidden".to_string(),
                        message: "Only creator can update event".to_string(),
                    });
                }

                // Update fields if provided
                if let Some(title) = updated_data.title {
                    if title.trim().is_empty() {
                        return Err(Error {
                            code: 400,
                            error: "Title cannot be empty".to_string(),
                            message: "Event title cannot be empty".to_string(),
                        });
                    }
                    event.title = title;
                }
                if let Some(description) = updated_data.description {
                    event.description = Some(description);
                }
                if let Some(location) = updated_data.location {
                    if location.description.trim().is_empty() {
                        return Err(Error {
                            code: 400,
                            error: "Location description cannot be empty".to_string(),
                            message: "Event location description cannot be empty".to_string(),
                        });
                    }
                    event.location = location;
                }
                if let Some(event_date) = updated_data.event_date {
                    let event_date_nanos = seconds_to_nanoseconds(event_date);
                    if event_date_nanos <= time() {
                        return Err(Error {
                            code: 400,
                            error: "Invalid event date".to_string(),
                            message: "Event date must be in the future".to_string(),
                        });
                    }
                    event.event_date = event_date_nanos;
                }
                if let Some(duration_hours) = updated_data.duration_hours {
                    event.duration_hours = duration_hours;
                }
                if let Some(max_participants) = updated_data.max_participants {
                    event.max_participants = Some(max_participants);
                }
                if let Some(sport) = updated_data.sport {
                    event.sport = sport;
                }
                if let Some(status) = updated_data.status {
                    event.status = status;
                }
                if let Some(images) = updated_data.images {
                    event.images = images;
                }
                if let Some(cost_per_person) = updated_data.cost_per_person {
                    event.cost_per_person = Some(cost_per_person);
                }
                if let Some(requirements) = updated_data.requirements {
                    event.requirements = requirements;
                }

                event.updated_at = time();
                events_map.insert(event_id, event);
                Ok(())
            } else {
                Err(Error {
                    code: 404,
                    error: "Event not found".to_string(),
                    message: "No event found with the given ID".to_string(),
                })
            }
        })
    }

    pub fn delete(event_id: u64) -> Result<(), Error> {
        let caller = ic_cdk::api::msg_caller();

        EVENTS.with(|events| {
            let mut events_map = events.borrow_mut();

            if let Some(event) = events_map.get(&event_id) {
                // Check if caller is the creator
                if event.creator_id != caller {
                    return Err(Error {
                        code: 403,
                        error: "Forbidden".to_string(),
                        message: "Only creator can delete event".to_string(),
                    });
                }

                events_map.remove(&event_id);
                Ok(())
            } else {
                Err(Error {
                    code: 404,
                    error: "Event not found".to_string(),
                    message: "No event found with the given ID".to_string(),
                })
            }
        })
    }

    pub async fn join(event_id: u64, user_id: Principal) -> Result<(), Error> {
        let mut event_opt = None;
        let mut event_title = String::new();

        let result = EVENTS.with(|events| {
            let mut events_map = events.borrow_mut();

            if let Some(mut event) = events_map.get(&event_id) {
                // Check if already joined
                if event.participants.contains(&user_id) {
                    return Err(Error {
                        code: 400,
                        error: "User already joined".to_string(),
                        message: "User is already a participant of the event".to_string(),
                    });
                }

                // Check if max participants reached (if set)
                if let Some(max_participants) = event.max_participants {
                    if event.participants.len() >= max_participants as usize {
                        return Err(Error {
                            code: 400,
                            error: "Maximum participants reached".to_string(),
                            message: "Cannot join event, maximum participants reached".to_string(),
                        });
                    }
                }

                // Check if event is still upcoming
                if event.status != EventStatus::Upcoming {
                    return Err(Error {
                        code: 400,
                        error: "Invalid event status".to_string(),
                        message: "Cannot join event that is not upcoming".to_string(),
                    });
                }

                event.participants.push(user_id.clone());
                event.updated_at = time();
                event_title = event.title.clone();
                event_opt = Some(event.clone());
                events_map.insert(event_id, event.clone());

                Ok(())
            } else {
                Err(Error {
                    code: 404,
                    error: "Event not found".to_string(),
                    message: "No event found with the given ID".to_string(),
                })
            }
        });

        if let Err(e) = result {
            return Err(e);
        }

        // Only send notification if event was successfully joined
        if let Some(_event) = event_opt {
            add_notification(
                user_id.clone(),
                NewNotification {
                    content: format!("You have joined the event: {}", event_title),
                    notification_type: NotificationType::Message,
                },
            )
            .await?;
        }

        Ok(())
    }

    pub fn leave(event_id: u64, user_id: Principal) -> Result<(), Error> {
        EVENTS.with(|events| {
            let mut events_map = events.borrow_mut();

            if let Some(mut event) = events_map.get(&event_id) {
                // Check if user is creator (creator cannot leave)
                if event.creator_id == user_id {
                    return Err(Error {
                        code: 403,
                        error: "Forbidden".to_string(),
                        message: "Creator cannot leave event".to_string(),
                    });
                }

                // Remove user from participants
                let initial_len = event.participants.len();
                event
                    .participants
                    .retain(|&participant| participant != user_id);

                if event.participants.len() == initial_len {
                    return Err(Error {
                        code: 404,
                        error: "User not found".to_string(),
                        message: "User is not a participant of the event".to_string(),
                    });
                }

                event.updated_at = time();
                events_map.insert(event_id, event);
                Ok(())
            } else {
                Err(Error {
                    code: 404,
                    error: "Event not found".to_string(),
                    message: "No event found with the given ID".to_string(),
                })
            }
        })
    }

    pub fn get_participants(event_id: u64) -> Result<Vec<Principal>, Error> {
        EVENTS.with(|events| {
            if let Some(event) = events.borrow().get(&event_id) {
                Ok(event.participants)
            } else {
                Err(Error {
                    code: 404,
                    error: "Event not found".to_string(),
                    message: "No event found with the given ID".to_string(),
                })
            }
        })
    }

    pub fn get_all() -> Vec<Event> {
        EVENTS.with(|events| events.borrow().values().collect::<Vec<Event>>())
    }

    pub fn filter_events(filter: EventFilter) -> Vec<Event> {
        // Get all events first, then filter them
        let all_events = Self::get_all();

        all_events
            .into_iter()
            .filter(|event| {
                (filter.governorate.is_none()
                    || Some(event.location.governorate) == filter.governorate)
                    && (filter.city.is_none() || Some(event.location.city) == filter.city)
                    && (filter.sport.is_none() || Some(event.sport.clone()) == filter.sport)
                    && (filter.status.is_none() || Some(event.status.clone()) == filter.status)
                    && (filter.cost_filter.is_none()
                        || match filter.cost_filter.as_ref().unwrap() {
                            CostFilter::Free => event.cost_per_person.is_none(),
                            CostFilter::Paid => event.cost_per_person.is_some(),
                            CostFilter::Range { min, max } => event
                                .cost_per_person
                                .map(|cost| cost >= *min && cost <= *max)
                                .unwrap_or(false),
                        })
            })
            .collect()
    }
}
