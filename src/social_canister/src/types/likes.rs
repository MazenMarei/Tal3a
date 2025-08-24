use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]
pub struct Likes {
    pub likes: Vec<Like>,
}

#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]
pub struct Like {
    pub target: LikeTarget,
    pub user_id: Principal,
    pub liked_at: u64,
}

#[derive(Debug, Clone, Deserialize, Serialize, CandidType, PartialEq)]
pub enum LikeTarget {
    Post(String),    // post_id
    Comment(String), // comment_id
}
