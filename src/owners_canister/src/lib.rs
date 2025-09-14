mod contracts;
mod services;
mod storage;
mod types;

use crate::types::{
    Owner, OwnerRole, Permission,
    GroupAdmin, GroupPermission,
    Error,
};

use candid::Principal;
use ic_cdk;

// Initialize the canister with the first super admin
// This runs once when the canister is first deployed
#[ic_cdk::init]
fn init() {
    services::owner::initialize_canister();
}

// Export contracts
ic_cdk::export_candid!();