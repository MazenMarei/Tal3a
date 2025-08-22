use crate::storage::{EVENTS, NEXT_EVENT_ID};
use crate::types::event::{Event, EventUpdate, CreateEventInput, EventStatus};
use crate::types::tal3a::{Tal3a, Tal3aUpdate, CreateTal3aInput, Tal3aStatus};
use candid::Principal;
use ic_cdk::api::time;

// Keep Tal3a implementation for backward compatibility while transitioning
impl Tal3a {
    pub fn new(group_id: u64, input: CreateTal3aInput) -> Result<u64, String> {
        // Convert to CreateEventInput
        let event_input = CreateEventInput {
            title: input.title,
            description: input.description,
            event_date: input.tal3a_date,
            duration_hours: input.duration_hours,
            location: input.location,
            sport: input.sport,
            max_participants: input.max_participants,
            images: input.images,
            cost_per_person: input.cost_per_person,
            requirements: input.requirements,
        };
        
        // Use Event::new internally
        Event::new(group_id, event_input)
    }

    pub fn get_by_id(tal3a_id: u64) -> Option<Tal3a> {
        // Get Event and convert to Tal3a for backward compatibility
        Event::get_by_id(tal3a_id).map(|event| Tal3a {
            id: event.id,
            group_id: event.group_id,
            creator_id: event.creator_id,
            title: event.title,
            description: event.description,
            tal3a_date: event.event_date,
            duration_hours: event.duration_hours,
            location: event.location,
            sport: event.sport,
            max_participants: event.max_participants,
            participants: event.participants,
            status: match event.status {
                EventStatus::Upcoming => Tal3aStatus::Upcoming,
                EventStatus::InProgress => Tal3aStatus::InProgress,
                EventStatus::Completed => Tal3aStatus::Completed,
                EventStatus::Cancelled => Tal3aStatus::Cancelled,
            },
            images: event.images,
            cost_per_person: event.cost_per_person,
            requirements: event.requirements,
            created_at: event.created_at,
            updated_at: event.updated_at,
        })
    }

    pub fn update(tal3a_id: u64, updated_data: Tal3aUpdate) -> Result<(), String> {
        // Convert to EventUpdate
        let event_update = EventUpdate {
            title: updated_data.title,
            description: updated_data.description,
            event_date: updated_data.tal3a_date,
            duration_hours: updated_data.duration_hours,
            location: updated_data.location,
            sport: updated_data.sport,
            max_participants: updated_data.max_participants,
            status: updated_data.status.map(|s| match s {
                Tal3aStatus::Upcoming => EventStatus::Upcoming,
                Tal3aStatus::InProgress => EventStatus::InProgress,
                Tal3aStatus::Completed => EventStatus::Completed,
                Tal3aStatus::Cancelled => EventStatus::Cancelled,
            }),
            images: updated_data.images,
            cost_per_person: updated_data.cost_per_person,
            requirements: updated_data.requirements,
        };
        
        Event::update(tal3a_id, event_update)
    }

    pub fn delete(tal3a_id: u64) -> Result<(), String> {
        Event::delete(tal3a_id)
    }

    pub fn join(tal3a_id: u64, user_id: Principal) -> Result<(), String> {
        Event::join(tal3a_id, user_id)
    }

    pub fn leave(tal3a_id: u64, user_id: Principal) -> Result<(), String> {
        Event::leave(tal3a_id, user_id)
    }

    pub fn get_participants(tal3a_id: u64) -> Result<Vec<Principal>, String> {
        Event::get_participants(tal3a_id)
    }
}

// Main Event implementation (the actual logic)
impl Event {
    pub fn new(group_id: u64, input: CreateEventInput) -> Result<u64, String> {
        let caller = ic_cdk::api::msg_caller();
        
        // Validate group_id exists (TODO: implement group validation)
        if group_id == 0 {
            return Err("Invalid group ID".to_string());
        }

        // Validate input data
        if input.title.trim().is_empty() {
            return Err("Title cannot be empty".to_string());
        }

        if input.location.trim().is_empty() {
            return Err("Location cannot be empty".to_string());
        }

        if input.event_date <= time() {
            return Err("Event date must be in the future".to_string());
        }

        let event_id = NEXT_EVENT_ID.with(|id| {
            let current_id = *id.borrow();
            *id.borrow_mut() = current_id + 1;
            current_id
        });

        let now = time();
        let new_event = Event {
            id: event_id,
            group_id,
            creator_id: caller,
            title: input.title,
            description: input.description,
            event_date: input.event_date,
            duration_hours: input.duration_hours,
            location: input.location,
            sport: input.sport,
            max_participants: input.max_participants,
            participants: vec![caller], // Creator is first participant
            status: EventStatus::Upcoming,
            images: input.images,
            cost_per_person: input.cost_per_person,
            requirements: input.requirements,
            created_at: now,
            updated_at: now,
        };

        EVENTS.with(|events| {
            events.borrow_mut().insert(event_id, new_event);
        });

        Ok(event_id)
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
                    if location.trim().is_empty() {
                        return Err("Location cannot be empty".to_string());
                    }
                    event.location = location;
                }
                if let Some(event_date) = updated_data.event_date {
                    if event_date <= time() {
                        return Err("Event date must be in the future".to_string());
                    }
                    event.event_date = event_date;
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
}
