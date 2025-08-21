use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use crate::types::sport::Sports;

// Tal3a status enum
#[derive(Debug, Clone, Deserialize, Serialize, CandidType, PartialEq)]
pub enum Tal3aStatus {
    Upcoming,    // upcoming
    InProgress,  // in progress
    Completed,   // completed
    Cancelled,   // cancelled
}

// Main Tal3a struct
#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]
pub struct Tal3a {
    pub id: u64,
    pub group_id: u64,
    pub creator_id: Principal,
    pub title: String,
    pub description: Option<String>,
    pub tal3a_date: u64,          // timestamp
    pub duration_hours: u8,       // duration in hours
    pub location: String,         // location
    pub sport: Sports,            // sport type
    pub max_participants: Option<u16>, // maximum participants
    pub participants: Vec<Principal>,   // participants list
    pub status: Tal3aStatus,
    pub images: Vec<Vec<u8>>,     // event images
    pub cost_per_person: Option<u64>,   // cost per person
    pub requirements: Vec<String>, // event requirements
    pub created_at: u64,
    pub updated_at: u64,
}

// Struct for creating new Tal3a (input from frontend)
#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]
pub struct CreateTal3aInput {
    pub title: String,
    pub description: Option<String>,
    pub tal3a_date: u64,
    pub duration_hours: u8,
    pub location: String,
    pub sport: Sports,
    pub max_participants: Option<u16>,
    pub images: Vec<Vec<u8>>,
    pub cost_per_person: Option<u64>,
    pub requirements: Vec<String>,
}

// Tal3aUpdate struct for updating Tal3a data
#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]
pub struct Tal3aUpdate {
    pub title: Option<String>,
    pub description: Option<String>,
    pub tal3a_date: Option<u64>,
    pub duration_hours: Option<u8>,
    pub location: Option<String>,
    pub sport: Option<Sports>,
    pub max_participants: Option<u16>,
    pub status: Option<Tal3aStatus>,
    pub images: Option<Vec<Vec<u8>>>,
    pub cost_per_person: Option<u64>,
    pub requirements: Option<Vec<String>>,
}
