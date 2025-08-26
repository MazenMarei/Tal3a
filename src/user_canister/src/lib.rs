mod contracts;
mod services;
mod storage;
mod types;

use crate::types::{
    activity::UserActivity,
    city::CityData,
    governorate::GovernorateData,
    notification::NewNotification,
    user::{PublicUser, RegisteringUser, UpdatingUser, User},
};

use candid::Principal;
use ic_cdk;

// * export contracts
ic_cdk::export_candid!();
