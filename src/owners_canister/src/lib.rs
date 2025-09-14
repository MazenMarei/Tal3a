mod contracts;
mod services;
mod storage;
mod types;

// Re-export all contract functions at the crate level
pub use contracts::owners::*;
pub use contracts::group_admins::*;

use crate::types::{
    Owner, OwnerRole, Permission,
    GroupAdmin, GroupPermission,
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