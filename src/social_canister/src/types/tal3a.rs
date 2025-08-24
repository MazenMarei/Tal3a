use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]

pub struct Tal3a {
    pub group_id: String,
    pub tal3a_id: String, // should be a unique identifier randomly generated
    pub created_by: Principal,

    
    pub tal3a_date: u64,
    pub place: String,
    pub max_members: Option<u32>,
    pub duration: Option<u32>,

    pub title: String,
    pub image: Vec<u8>,
    pub created_at: u64,
}
