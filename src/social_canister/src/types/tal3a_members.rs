use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]

pub enum JoinStatus {
    Going,
    CantGo,
    Maybe,
}

#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]

pub struct Tal3aMember {
    pub group_id: String,
    pub user_id: Principal,
    pub tal3a_id: String, // should be a unique identifier randomly generated

    pub status: JoinStatus,
    pub joined_at: u64,
}

#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]

pub struct Tal3aMembers {
    pub member: Tal3aMember,
}
