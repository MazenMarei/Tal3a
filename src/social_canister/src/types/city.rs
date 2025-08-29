use serde::{Deserialize, Serialize};
use candid::CandidType;

#[derive(Debug , Clone , Deserialize , Serialize , CandidType)]
pub struct CityData {
    pub name: String,
    pub name_l1: String,
    pub slug: String,
    pub id: u16,
}