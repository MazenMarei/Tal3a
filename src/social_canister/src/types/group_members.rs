use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]

pub struct GroupMember {
    pub group_id: String,
    pub user_id: Principal,
    pub joined_at: u64,
}

#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]
pub struct GroupMembers {
    pub members: Vec<GroupMember>,
}
