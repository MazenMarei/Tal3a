use crate::storage::{EVENTS, NEXT_EVENT_ID};
use crate::types::event::{Event, EventUpdate, CreateEventInput, EventStatus};
use candid::Principal;
use ic_cdk::api::time;

// Main Event implementation
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
