use serde::{Deserialize, Serialize};
use candid::{Principal, CandidType};

#[derive(Debug , Clone , Deserialize , Serialize , CandidType)]

pub struct GroupMembers {
    pub group_id : String,
    pub user_id : Principal,
    pub joined_at: u64,
}