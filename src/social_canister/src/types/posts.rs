use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]

pub struct Comments {
    pub group_id: String,
    pub post_id: String, // should be a UUID
    pub user_id: Principal,
    
    pub content: String,
    pub images: Vec<Vec<u8>>,
    pub created_at: u64,
}
