use crate::types::sport::Sports;
use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize, CandidType, PartialEq)]
pub enum GroupType {
    Group,
    Club,
}

#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]

pub struct Group {
    pub id: String,
    pub governorate_id: u8,
    pub city_id: u16,
    pub name: String,
    pub sport_type: Sports,
    pub description: String,
    pub created_at: u64,
    pub created_by: Principal,
    pub image: Vec<u8>,
    pub parent_group_id: Option<String>,
    pub public: bool,

    pub members: u128,
    pub posts: u128,
}
#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]
pub struct CreatingGroup {
    pub name: String,
    pub governorate_id: u8,
    pub city_id: u16,
    pub description: String,
    pub sport_type: Sports,
    pub image: Option<Vec<u8>>,
    pub parent_group_id: Option<String>,
    pub public: bool,
}
#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]
pub struct GroupFilter {
    pub governorate_id: Option<u8>,
    pub city_id: Option<u16>,
    pub sport_type: Option<Sports>,
    pub group_type: Option<GroupType>,
}
