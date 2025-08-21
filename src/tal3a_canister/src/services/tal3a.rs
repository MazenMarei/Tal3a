use crate::storage::{TAL3AS, NEXT_TAL3A_ID};
use crate::types::tal3a::{Tal3a, Tal3aUpdate};
use candid::Principal;
use ic_cdk::api::time;

impl Tal3a {
    pub fn new(group_id: u64, tal3a_data: Tal3a) -> Result<u64, String> {
        let caller = ic_cdk::api::msg_caller();
        
        // Validate group_id exists (TODO: implement group validation)
        if group_id == 0 {
            return Err("Invalid group ID".to_string());
        }

        let tal3a_id = NEXT_TAL3A_ID.with(|id| {
            let current_id = *id.borrow();
            *id.borrow_mut() = current_id + 1;
            current_id
        });

        let mut new_tal3a = tal3a_data;
        new_tal3a.id = tal3a_id;
        new_tal3a.group_id = group_id;
        new_tal3a.created_by = caller;
        new_tal3a.created_at = time();
        new_tal3a.participants = vec![caller]; // Creator is first participant

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
                if tal3a.created_by != caller {
                    return Err("Only creator can update tal3a".to_string());
                }

                // Update fields if provided
                if let Some(title) = updated_data.title {
                    tal3a.title = title;
                }
                if let Some(description) = updated_data.description {
                    tal3a.description = description;
                }
                if let Some(location) = updated_data.location {
                    tal3a.location = location;
                }
                if let Some(date_time) = updated_data.date_time {
                    tal3a.date_time = date_time;
                }
                if let Some(max_participants) = updated_data.max_participants {
                    tal3a.max_participants = max_participants;
                }
                if let Some(sport) = updated_data.sport {
                    tal3a.sport = sport;
                }

                tal3a.updated_at = Some(time());
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
                if tal3a.created_by != caller {
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

                // Check if max participants reached
                if tal3a.participants.len() >= tal3a.max_participants as usize {
                    return Err("Maximum participants reached".to_string());
                }

                tal3a.participants.push(user_id);
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
                if tal3a.created_by == user_id {
                    return Err("Creator cannot leave tal3a".to_string());
                }

                // Remove user from participants
                tal3a.participants.retain(|&participant| participant != user_id);
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
