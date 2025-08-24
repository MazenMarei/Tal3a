use candid::CandidType;
use serde::{Deserialize, Serialize};

// * sports enum
#[derive(Clone , CandidType, Deserialize, Serialize)]
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
