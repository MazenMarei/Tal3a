use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

// * Comment struct for Tal3a comments
#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]
pub struct Comment {
    pub id: u64,
    pub tal3a_id: u64,
    pub user_id: Principal,
    pub content: String,
    pub parent_comment_id: Option<u64>,
    pub created_at: u64,
    pub updated_at: u64,
}

// * Input struct for creating comments
#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]
pub struct CreateCommentInput {
    pub content: String,
    pub parent_comment_id: Option<u64>,
}
