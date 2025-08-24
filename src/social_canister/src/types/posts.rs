use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]

pub struct Post {
    pub group_id: String,
    pub post_id: String, // should be a unique identifier randomly generated
    pub author: Principal,

    pub content: String,
    pub images: Option<Vec<Vec<u8>>>,
    pub created_at: u64,
    pub updated_at: u64,

    pub likes: u64,
    pub comments: u64,
}

#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]
pub struct NewPost {
    pub group_id: String,
    pub content: String,
    pub images: Option<Vec<Vec<u8>>>,
}

#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]
pub struct UpdatePost {
    pub post_id: String,
    pub content: Option<String>,
    pub images: Option<Vec<Vec<u8>>>,
}
