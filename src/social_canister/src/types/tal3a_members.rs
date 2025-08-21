use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]

pub struct GroupMembers {
    pub group_id: String,
    pub user_id: Principal,
    pub tal3a_id: String, // should be a UUID

    pub status: String, // e.g., "going" , "can't go" , "Maybe"

    pub joined_at: u64,
}
