use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

// Review struct for Event reviews
#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]
pub struct Review {
    pub id: u64,
    pub event_id: u64,
    pub user_id: Principal,
    pub rating: u8,           // 1 to 5 stars
    pub comment: Option<String>,
    pub created_at: u64,
}

// Input struct for creating reviews
#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]
pub struct CreateReviewInput {
    pub rating: u8,           // 1 to 5 stars
    pub comment: Option<String>,
}
