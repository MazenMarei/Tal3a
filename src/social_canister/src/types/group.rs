use serde::{Deserialize, Serialize};
use candid::{Principal, CandidType};
use crate::types::sport::Sports;


#[derive(Debug , Clone , Deserialize , Serialize , CandidType)]

pub struct Group {

    pub id: String,
    pub governorate_id: u8,
    pub city_id: u8,
    pub name: String,
    pub sport_type: Sports,
    pub description: String,
    pub created_at: u64,
    pub created_by : Principal,
    pub image: Vec<u8>,
    pub parent_group_id: Option<String>,
    pub public: bool,

}