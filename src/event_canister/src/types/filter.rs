use candid::CandidType;
use serde::{Deserialize, Serialize};
use crate::types::sport::Sports;
use crate::types::event::EventStatus;

#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]
pub struct EventFilter {
    pub governorate: Option<u8>,
    pub city: Option<u16>,
    pub sport: Option<Sports>,
    pub status: Option<EventStatus>,
    pub cost_filter: Option<CostFilter>,
}

#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]
pub enum CostFilter {
    Free,                         // cost_per_person is None
    Paid,                        // cost_per_person is Some
    Range { min: u64, max: u64 }, // cost range filter
}
