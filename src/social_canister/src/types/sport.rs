use candid::CandidType;
use serde::{Deserialize, Serialize};

// * sports enum

#[derive( Clone, CandidType, Deserialize, Serialize, Debug, PartialEq)]
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

impl Sports {
    pub fn as_str(&self) -> &str {
        match self {
            Sports::Football => "Football",
            Sports::Basketball => "Basketball",
            Sports::Volleyball => "Volleyball",
            Sports::Handball => "Handball",
            Sports::Tennis => "Tennis",
            Sports::Padel => "Padel",
            Sports::Cycling => "Cycling",
            Sports::Running => "Running",
            Sports::Skateboarding => "Skateboarding",
            Sports::Camping => "Camping",
            Sports::Fitness => "Fitness",
            Sports::Swimming => "Swimming",
        }
    }
}
