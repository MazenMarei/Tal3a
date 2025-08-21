use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

// Comment data structure
#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]
pub struct Comment {
    pub id: u64,
    pub tal3a_id: u64,
    pub author_id: Principal,
    pub content: String,
    pub parent_comment_id: Option<u64>, // for nested comments
    pub created_at: u64,
    pub updated_at: Option<u64>,
}

// Input structure for creating comments
#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]
pub struct CreateCommentInput {
    pub content: String,
    pub parent_comment_id: Option<u64>,
}
