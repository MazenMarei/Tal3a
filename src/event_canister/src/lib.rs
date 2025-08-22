mod contracts;
mod services;
mod storage;
mod types;

use crate::types::{
    comment::Comment,
    review::Review,
    event::{Event, EventUpdate, CreateEventInput},
};

use candid::Principal;
use ic_cdk;

// Export contracts
ic_cdk::export_candid!();
