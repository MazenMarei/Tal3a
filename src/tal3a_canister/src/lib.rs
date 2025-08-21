mod contracts;
mod services;
mod storage;
mod types;

use crate::types::{
    comment::Comment,
    review::Review,
    tal3a::{Tal3a, Tal3aUpdate, CreateTal3aInput},
};

use candid::Principal;
use ic_cdk;

// Export contracts
ic_cdk::export_candid!();
