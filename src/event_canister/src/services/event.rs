use crate::storage::EVENTS;
use crate::types::event::{Event, EventUpdate, CreateEventInput, EventStatus};
use crate::types::filter::EventFilter;
use crate::types::response::seconds_to_nanoseconds;
use crate::utils::generate_unique_id;
use candid::Principal;
use ic_cdk::api::time;

impl Event {
    pub async fn new(group_id: u64, input: CreateEventInput) -> Result<Event, String> {
        let caller = ic_cdk::api::msg_caller();
        
        // Validate group_id exists (TODO: implement group validation)
        if group_id == 0 {
            return Err("Invalid group ID".to_string());
        }

        // Validate input data
        if input.title.trim().is_empty() {
            return Err("Title cannot be empty".to_string());
        }

        if input.location.description.trim().is_empty() {
            return Err("Location description cannot be empty".to_string());
        }

        // Convert frontend seconds to nanoseconds for comparison
        let event_date_nanos = seconds_to_nanoseconds(input.event_date);
        if event_date_nanos <= time() {
            return Err("Event date must be in the future".to_string());
        }

        let event_id = generate_unique_id().await?;

        let now = time();
        let new_event = Event {
            id: event_id,
            group_id,
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
        EVENTS.with(|events| {
            events.borrow().get(&event_id)
        })
    }

    pub fn update(event_id: u64, updated_data: EventUpdate) -> Result<(), String> {
        let caller = ic_cdk::api::msg_caller();

        EVENTS.with(|events| {
            let mut events_map = events.borrow_mut();
            
            if let Some(mut event) = events_map.get(&event_id) {
                // Check if caller is the creator
                if event.creator_id != caller {
                    return Err("Only creator can update event".to_string());
                }

                // Update fields if provided
                if let Some(title) = updated_data.title {
                    if title.trim().is_empty() {
                        return Err("Title cannot be empty".to_string());
                    }
                    event.title = title;
                }
                if let Some(description) = updated_data.description {
                    event.description = Some(description);
                }
                if let Some(location) = updated_data.location {
                    if location.description.trim().is_empty() {
                        return Err("Location description cannot be empty".to_string());
                    }
                    event.location = location;
                }
                if let Some(event_date) = updated_data.event_date {
                    let event_date_nanos = seconds_to_nanoseconds(event_date);
                    if event_date_nanos <= time() {
                        return Err("Event date must be in the future".to_string());
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
                Err("Event not found".to_string())
            }
        })
    }

    pub fn delete(event_id: u64) -> Result<(), String> {
        let caller = ic_cdk::api::msg_caller();

        EVENTS.with(|events| {
            let mut events_map = events.borrow_mut();
            
            if let Some(event) = events_map.get(&event_id) {
                // Check if caller is the creator
                if event.creator_id != caller {
                    return Err("Only creator can delete event".to_string());
                }

                events_map.remove(&event_id);
                Ok(())
            } else {
                Err("Event not found".to_string())
            }
        })
    }

    pub fn join(event_id: u64, user_id: Principal) -> Result<(), String> {
        EVENTS.with(|events| {
            let mut events_map = events.borrow_mut();
            
            if let Some(mut event) = events_map.get(&event_id) {
                // Check if already joined
                if event.participants.contains(&user_id) {
                    return Err("User already joined".to_string());
                }

                // Check if max participants reached (if set)
                if let Some(max_participants) = event.max_participants {
                    if event.participants.len() >= max_participants as usize {
                        return Err("Maximum participants reached".to_string());
                    }
                }

                // Check if event is still upcoming
                if event.status != EventStatus::Upcoming {
                    return Err("Cannot join event that is not upcoming".to_string());
                }

                event.participants.push(user_id);
                event.updated_at = time();
                events_map.insert(event_id, event);
                Ok(())
            } else {
                Err("Event not found".to_string())
            }
        })
    }

    pub fn leave(event_id: u64, user_id: Principal) -> Result<(), String> {
        EVENTS.with(|events| {
            let mut events_map = events.borrow_mut();
            
            if let Some(mut event) = events_map.get(&event_id) {
                // Check if user is creator (creator cannot leave)
                if event.creator_id == user_id {
                    return Err("Creator cannot leave event".to_string());
                }

                // Remove user from participants
                let initial_len = event.participants.len();
                event.participants.retain(|&participant| participant != user_id);
                
                if event.participants.len() == initial_len {
                    return Err("User is not a participant".to_string());
                }

                event.updated_at = time();
                events_map.insert(event_id, event);
                Ok(())
            } else {
                Err("Event not found".to_string())
            }
        })
    }

    pub fn get_participants(event_id: u64) -> Result<Vec<Principal>, String> {
        EVENTS.with(|events| {
            if let Some(event) = events.borrow().get(&event_id) {
                Ok(event.participants)
            } else {
                Err("Event not found".to_string())
            }
        })
    }

    pub fn get_all() -> Vec<Event> {
        EVENTS.with(|events| {
            let events_map = events.borrow();
            let mut all_events = Vec::new();
            
            // Use a simple range to get all events
            let mut id = 1u64;
            loop {
                if let Some(event) = events_map.get(&id) {
                    all_events.push(event);
                    id += 1;
                } else {
                    // Try next few IDs in case there are gaps
                    let mut found_any = false;
                    for check_id in (id + 1)..(id + 100) {
                        if events_map.get(&check_id).is_some() {
                            found_any = true;
                            break;
                        }
                    }
                    if found_any {
                        id += 1;
                    } else {
                        break;
                    }
                }
            }
            
            all_events
        })
    }

    pub fn filter_events(filter: EventFilter) -> Vec<Event> {
        // Get all events first, then filter them
        let all_events = Self::get_all();
        
        all_events.into_iter().filter(|event| {
            // Filter by governorate
            if let Some(ref governorate) = filter.governorate {
                if &event.location.governorate != governorate {
                    return false;
                }
            }

            // Filter by city
            if let Some(ref city) = filter.city {
                if &event.location.city != city {
                    return false;
                }
            }

            // Filter by sport
            if let Some(ref sport) = filter.sport {
                if &event.sport != sport {
                    return false;
                }
            }

            // Filter by status
            if let Some(ref status) = filter.status {
                if &event.status != status {
                    return false;
                }
            }

            // Filter by cost
            if let Some(ref cost_filter) = filter.cost_filter {
                use crate::types::filter::CostFilter;
                match cost_filter {
                    CostFilter::Free => {
                        if event.cost_per_person.is_some() {
                            return false;
                        }
                    }
                    CostFilter::Paid => {
                        if event.cost_per_person.is_none() {
                            return false;
                        }
                    }
                    CostFilter::Range { min, max } => {
                        if let Some(cost) = event.cost_per_person {
                            if cost < *min || cost > *max {
                                return false;
                            }
                        } else {
                            return false;
                        }
                    }
                }
            }

            true
        }).collect()
    }
}
