use candid::CandidType;
use serde::{Deserialize, Serialize};

// * sports enum - reused from user_canister
#[derive(Clone, CandidType, Deserialize, Serialize, Debug, PartialEq)]
pub enum Sports {
    Football,
    Basketball,
    Volleyball,
    Handball,
    Tennis,
    Padel,
    Cycling,
    Running,
    Skateboarding,
    Camping,
    Fitness,
    Swimming,
}
