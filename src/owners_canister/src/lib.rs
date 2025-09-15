mod contracts;
mod services;
mod storage;
mod types;

// Re-export public API endpoints from contracts
pub use contracts::*;

use ic_cdk::init;
use candid::Principal;
use types::{Owner, OwnerRole, Permission, GroupAdmin, GroupPermission};

#[init]
fn init() {
    services::owner::initialize_canister();
}

ic_cdk::export_candid!();