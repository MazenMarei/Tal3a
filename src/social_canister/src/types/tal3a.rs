use candid::CandidType;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]

pub struct Comments {
    pub group_id: String,
    pub tal3a_id: String, // should be a UUID

    pub tal3a_date: u64,
    pub place: String,

    pub title: String,
    pub image: Vec<u8>,
    pub created_at: u64,
}
