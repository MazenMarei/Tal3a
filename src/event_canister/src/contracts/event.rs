use crate::types::event::{CreateEventInput, Event, EventUpdate};
use crate::types::filter::EventFilter;
use crate::types::response::EventResponse;
use candid::Principal;
use ic_cdk::{query, update};
use crate::types::error::Error;

#[update]
async fn create_event(event_data: CreateEventInput) -> Result<EventResponse, Error> {
    let event = Event::new(event_data).await?;
    Ok(EventResponse::from(event))
}

#[update]
fn update_event(event_id: u64, updated_data: EventUpdate) -> Result<(), Error> {
    Event::update(event_id, updated_data)
}

#[update]
fn delete_event(event_id: u64) -> Result<(), Error> {
    Event::delete(event_id)
}

#[update]
async fn join_event(event_id: u64) -> Result<(), Error> {
    let user_id = ic_cdk::api::msg_caller();
    Event::join(event_id, user_id).await
}

#[update]
fn leave_event(event_id: u64) -> Result<(), Error> {
    let user_id = ic_cdk::api::msg_caller();
    Event::leave(event_id, user_id)
}

#[query]
fn get_event(event_id: u64) -> Option<EventResponse> {
    Event::get_by_id(event_id).map(EventResponse::from)
}

#[query]
fn get_event_participants(event_id: u64) -> Result<Vec<Principal>, Error> {
    Event::get_participants(event_id)
}

#[query]
fn get_all_events() -> Vec<EventResponse> {
    Event::get_all()
        .into_iter()
        .map(EventResponse::from)
        .collect()
}

#[query]
fn filter_events(filter: EventFilter) -> Vec<EventResponse> {
    Event::filter_events(filter)
        .into_iter()
        .map(EventResponse::from)
        .collect()
}
