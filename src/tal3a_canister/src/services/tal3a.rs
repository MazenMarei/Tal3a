use crate::storage::{EVENTS, NEXT_EVENT_ID};
use crate::types::tal3a::{Tal3a, Tal3aUpdate, CreateTal3aInput, Tal3aStatus};
use candid::Principal;
use ic_cdk::api::time;

impl Tal3a {
    pub fn new(group_id: u64, input: CreateTal3aInput) -> Result<u64, String> {
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

        if input.tal3a_date <= time() {
            return Err("Event date must be in the future".to_string());
        }

        let tal3a_id = NEXT_TAL3A_ID.with(|id| {
            let current_id = *id.borrow();
            *id.borrow_mut() = current_id + 1;
            current_id
        });

        let now = time();
        let new_tal3a = Tal3a {
            id: tal3a_id,
            group_id,
            creator_id: caller,
            title: input.title,
            description: input.description,
            tal3a_date: input.tal3a_date,
            duration_hours: input.duration_hours,
            location: input.location,
            sport: input.sport,
            max_participants: input.max_participants,
            participants: vec![caller], // Creator is first participant
            status: Tal3aStatus::Upcoming,
            images: input.images,
            cost_per_person: input.cost_per_person,
            requirements: input.requirements,
            created_at: now,
            updated_at: now,
        };

        TAL3AS.with(|tal3as| {
            tal3as.borrow_mut().insert(tal3a_id, new_tal3a);
        });

        Ok(tal3a_id)
    }

    pub fn get_by_id(tal3a_id: u64) -> Option<Tal3a> {
        TAL3AS.with(|tal3as| {
            tal3as.borrow().get(&tal3a_id)
        })
    }

    pub fn update(tal3a_id: u64, updated_data: Tal3aUpdate) -> Result<(), String> {
        let caller = ic_cdk::api::msg_caller();

        TAL3AS.with(|tal3as| {
            let mut tal3as_map = tal3as.borrow_mut();
            
            if let Some(mut tal3a) = tal3as_map.get(&tal3a_id) {
                // Check if caller is the creator
                if tal3a.creator_id != caller {
                    return Err("Only creator can update tal3a".to_string());
                }

                // Update fields if provided
                if let Some(title) = updated_data.title {
                    if title.trim().is_empty() {
                        return Err("Title cannot be empty".to_string());
                    }
                    tal3a.title = title;
                }
                if let Some(description) = updated_data.description {
                    tal3a.description = Some(description);
                }
                if let Some(location) = updated_data.location {
                    if location.trim().is_empty() {
                        return Err("Location cannot be empty".to_string());
                    }
                    tal3a.location = location;
                }
                if let Some(tal3a_date) = updated_data.tal3a_date {
                    if tal3a_date <= time() {
                        return Err("Event date must be in the future".to_string());
                    }
                    tal3a.tal3a_date = tal3a_date;
                }
                if let Some(duration_hours) = updated_data.duration_hours {
                    tal3a.duration_hours = duration_hours;
                }
                if let Some(max_participants) = updated_data.max_participants {
                    tal3a.max_participants = Some(max_participants);
                }
                if let Some(sport) = updated_data.sport {
                    tal3a.sport = sport;
                }
                if let Some(status) = updated_data.status {
                    tal3a.status = status;
                }
                if let Some(images) = updated_data.images {
                    tal3a.images = images;
                }
                if let Some(cost_per_person) = updated_data.cost_per_person {
                    tal3a.cost_per_person = Some(cost_per_person);
                }
                if let Some(requirements) = updated_data.requirements {
                    tal3a.requirements = requirements;
                }

                tal3a.updated_at = time();
                tal3as_map.insert(tal3a_id, tal3a);
                Ok(())
            } else {
                Err("Tal3a not found".to_string())
            }
        })
    }

    pub fn delete(tal3a_id: u64) -> Result<(), String> {
        let caller = ic_cdk::api::msg_caller();

        TAL3AS.with(|tal3as| {
            let mut tal3as_map = tal3as.borrow_mut();
            
            if let Some(tal3a) = tal3as_map.get(&tal3a_id) {
                // Check if caller is the creator
                if tal3a.creator_id != caller {
                    return Err("Only creator can delete tal3a".to_string());
                }

                tal3as_map.remove(&tal3a_id);
                Ok(())
            } else {
                Err("Tal3a not found".to_string())
            }
        })
    }

    pub fn join(tal3a_id: u64, user_id: Principal) -> Result<(), String> {
        TAL3AS.with(|tal3as| {
            let mut tal3as_map = tal3as.borrow_mut();
            
            if let Some(mut tal3a) = tal3as_map.get(&tal3a_id) {
                // Check if already joined
                if tal3a.participants.contains(&user_id) {
                    return Err("User already joined".to_string());
                }

                // Check if max participants reached (if set)
                if let Some(max_participants) = tal3a.max_participants {
                    if tal3a.participants.len() >= max_participants as usize {
                        return Err("Maximum participants reached".to_string());
                    }
                }

                // Check if event is still upcoming
                if tal3a.status != Tal3aStatus::Upcoming {
                    return Err("Cannot join event that is not upcoming".to_string());
                }

                tal3a.participants.push(user_id);
                tal3a.updated_at = time();
                tal3as_map.insert(tal3a_id, tal3a);
                Ok(())
            } else {
                Err("Tal3a not found".to_string())
            }
        })
    }

    pub fn leave(tal3a_id: u64, user_id: Principal) -> Result<(), String> {
        TAL3AS.with(|tal3as| {
            let mut tal3as_map = tal3as.borrow_mut();
            
            if let Some(mut tal3a) = tal3as_map.get(&tal3a_id) {
                // Check if user is creator (creator cannot leave)
                if tal3a.creator_id == user_id {
                    return Err("Creator cannot leave tal3a".to_string());
                }

                // Remove user from participants
                let initial_len = tal3a.participants.len();
                tal3a.participants.retain(|&participant| participant != user_id);
                
                if tal3a.participants.len() == initial_len {
                    return Err("User is not a participant".to_string());
                }

                tal3a.updated_at = time();
                tal3as_map.insert(tal3a_id, tal3a);
                Ok(())
            } else {
                Err("Tal3a not found".to_string())
            }
        })
    }

    pub fn get_participants(tal3a_id: u64) -> Result<Vec<Principal>, String> {
        TAL3AS.with(|tal3as| {
            if let Some(tal3a) = tal3as.borrow().get(&tal3a_id) {
                Ok(tal3a.participants)
            } else {
                Err("Tal3a not found".to_string())
            }
        })
    }
}
