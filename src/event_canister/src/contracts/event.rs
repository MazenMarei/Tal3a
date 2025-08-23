use crate::types::event::{Event, EventUpdate, CreateEventInput};
use crate::types::filter::EventFilter;
use crate::types::response::EventResponse;
use candid::Principal;
use ic_cdk::{query, update};

#[update]
async fn create_event(group_id: u64, event_data: CreateEventInput) -> Result<EventResponse, String> {
    let event = Event::new(group_id, event_data).await?;
    Ok(EventResponse::from(event))
}

#[update]
fn update_event(event_id: u64, updated_data: EventUpdate) -> Result<(), String> {
    Event::update(event_id, updated_data)
}

#[update]
fn delete_event(event_id: u64) -> Result<(), String> {
    Event::delete(event_id)
}

#[update]
fn join_event(event_id: u64, user_id: Principal) -> Result<(), String> {
    Event::join(event_id, user_id)
}

#[update]
fn leave_event(event_id: u64, user_id: Principal) -> Result<(), String> {
    Event::leave(event_id, user_id)
}

#[query]
fn get_event(event_id: u64) -> Option<EventResponse> {
    Event::get_by_id(event_id).map(EventResponse::from)
}

#[query]
fn get_event_participants(event_id: u64) -> Result<Vec<Principal>, String> {
    Event::get_participants(event_id)
}

#[query]
fn get_all_events() -> Vec<EventResponse> {
    Event::get_all().into_iter().map(EventResponse::from).collect()
}

#[query]
fn filter_events(filter: EventFilter) -> Vec<EventResponse> {
    Event::filter_events(filter).into_iter().map(EventResponse::from).collect()
}
