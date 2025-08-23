use candid::CandidType;
use serde::{Deserialize, Serialize};

// Helper functions for time conversion
pub fn nanoseconds_to_seconds(nanos: u64) -> u64 {
    nanos / 1_000_000_000
}

pub fn seconds_to_nanoseconds(seconds: u64) -> u64 {
    seconds * 1_000_000_000
}

pub fn format_timestamp(nanos: u64) -> String {
    let seconds = nanoseconds_to_seconds(nanos);
    // Convert to readable format (you can customize this)
    format!("Timestamp: {} seconds since epoch", seconds)
}

// Event with formatted dates for frontend
#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]
pub struct EventResponse {
    pub id: u64,
    pub group_id: u64,
    pub creator_id: candid::Principal,
    pub title: String,
    pub description: Option<String>,
    pub event_date: u64,          // In seconds for frontend
    pub event_date_formatted: String, // Human readable
    pub duration_hours: u8,
    pub location: crate::types::location::Location,
    pub sport: crate::types::sport::Sports,
    pub max_participants: Option<u16>,
    pub participants: Vec<candid::Principal>,
    pub status: crate::types::event::EventStatus,
    pub images: Vec<Vec<u8>>,
    pub cost_per_person: Option<u64>,
    pub requirements: Vec<String>,
    pub created_at: u64,          // In seconds for frontend
    pub updated_at: u64,          // In seconds for frontend
}

impl From<crate::types::event::Event> for EventResponse {
    fn from(event: crate::types::event::Event) -> Self {
        Self {
            id: event.id,
            group_id: event.group_id,
            creator_id: event.creator_id,
            title: event.title,
            description: event.description,
            event_date: nanoseconds_to_seconds(event.event_date),
            event_date_formatted: format_timestamp(event.event_date),
            duration_hours: event.duration_hours,
            location: event.location,
            sport: event.sport,
            max_participants: event.max_participants,
            participants: event.participants,
            status: event.status,
            images: event.images,
            cost_per_person: event.cost_per_person,
            requirements: event.requirements,
            created_at: nanoseconds_to_seconds(event.created_at),
            updated_at: nanoseconds_to_seconds(event.updated_at),
        }
    }
}
