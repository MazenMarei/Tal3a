use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use crate::types::sport::Sports;
use crate::types::location::Location;

// Event status enum
#[derive(Debug, Clone, Deserialize, Serialize, CandidType, PartialEq)]
pub enum EventStatus {
    Upcoming,    // upcoming
    InProgress,  // in progress
    Completed,   // completed
    Cancelled,   // cancelled
}

// Main Event struct
#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]
pub struct Event {
    pub id: u64,
    pub group_id: u64,
    pub creator_id: Principal,
    pub title: String,
    pub description: Option<String>,
    pub event_date: u64,          // timestamp
    pub duration_hours: u8,       // duration in hours
    pub location: Location,       // location with governorate, city, description
    pub sport: Sports,            // sport type
    pub max_participants: Option<u16>, // maximum participants
    pub participants: Vec<Principal>,   // participants list
    pub status: EventStatus,
    pub images: Vec<Vec<u8>>,     // event images
    pub cost_per_person: Option<u64>,   // cost per person
    pub requirements: Vec<String>, // event requirements
    pub created_at: u64,
    pub updated_at: u64,
}

// Struct for creating new Event (input from frontend)
#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]
pub struct CreateEventInput {
    pub title: String,
    pub description: Option<String>,
    pub event_date: u64,
    pub duration_hours: u8,
    pub location: Location,
    pub sport: Sports,
    pub max_participants: Option<u16>,
    pub images: Vec<Vec<u8>>,
    pub cost_per_person: Option<u64>,
    pub requirements: Vec<String>,
}

// EventUpdate struct for updating Event data
#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]
pub struct EventUpdate {
    pub title: Option<String>,
    pub description: Option<String>,
    pub event_date: Option<u64>,
    pub duration_hours: Option<u8>,
    pub location: Option<Location>,
    pub sport: Option<Sports>,
    pub max_participants: Option<u16>,
    pub status: Option<EventStatus>,
    pub images: Option<Vec<Vec<u8>>>,
    pub cost_per_person: Option<u64>,
    pub requirements: Option<Vec<String>>,
}
