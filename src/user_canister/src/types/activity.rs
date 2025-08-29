use crate::types::sport::Sports;
use candid::CandidType;
use candid::Principal;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Clone, CandidType)]
pub struct UserActivity {
    pub user_id: Principal,
    pub sport: Sports,
    pub duration: u64, // duration in minutes
    pub time: u64,     // start time in seconds
    pub distance: Option<f64>, // for sports like running, cycling, etc.
                       // should be there more fields for different sports
}
