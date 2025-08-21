use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]

pub struct Comments {
    pub group_id: String,
    pub post_id: String, // should be a UUID
    pub user_id: Principal,
    pub comment_id: String, // should be a UUID
    pub parent_comment_id: Option<String>, // should be a UUID
    pub level: u8,
    
    pub content: String,
    pub image: Vec<u8>,
    pub created_at: u64,
}
