use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]

pub struct Likes {
    pub group_id: String,
    pub user_id: Principal,
    pub liked_at: u64,
    pub post_id: String, // should be a UUID
}
