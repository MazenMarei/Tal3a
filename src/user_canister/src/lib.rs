pub mod contracts;
pub mod services;
pub mod storage;
pub mod types;

pub use crate::types::{
    city::CityData,
    governorate::GovernorateData,
    notification::NewNotification,
    user::{RegisteringUser, UpdatingUser, User},
};

use candid::Principal;
use ic_cdk;


// * export contracts
ic_cdk::export_candid!();
