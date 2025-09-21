mod contracts;
mod services;
mod storage;
mod types;

// Re-export public API endpoints from contracts
pub use contracts::*;

use candid::Principal;
use ic_cdk::init;
use types::{
    AdminRequest, CreateAdminRequest, Error, GroupAdmin, GroupPermission, Owner, OwnerRole,
    Permission, ProcessAdminRequest,
};

#[init]
fn init() {
    services::owner::initialize_canister();
}

ic_cdk::export_candid!();
