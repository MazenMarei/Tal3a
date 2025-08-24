use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]

pub struct Comments {
    pub group_id: String,
    pub post_id: String, // should be a unique identifier randomly generated
    pub author: Principal,
    pub comment_id: String, // should be a unique identifier randomly generated
    pub parent_comment_id: Option<String>, // should be a unique identifier randomly generated
    pub level: u8,
    pub path_key: String,

    pub content: String,
    pub image: Vec<u8>,
    pub created_at: u64,
    pub updated_at: u64,
}
