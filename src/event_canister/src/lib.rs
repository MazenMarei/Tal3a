mod contracts;
mod middleware;
mod services;
mod storage;
mod types;
mod utils;

use crate::types::{
    review::Review,
    event::{EventUpdate, CreateEventInput},
    filter::EventFilter,
    response::EventResponse,
};

use candid::Principal;
use ic_cdk;

// Export contracts
ic_cdk::export_candid!();
