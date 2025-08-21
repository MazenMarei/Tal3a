use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]

pub struct Comments {
    pub group_id: String,
    pub post_id: String,
    pub user_id: Principal,
    // pub
    pub content: String,
    pub image: Vec<u8>,
    pub created_at: u64,
}
