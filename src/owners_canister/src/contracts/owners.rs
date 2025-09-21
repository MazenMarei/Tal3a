use crate::types::{Error, Owner, OwnerRole, Permission};
use crate::services;
use candid::Principal;
use ic_cdk::{query, update};

// Add a new owner (only super admins can do this)
#[update]
pub fn add_owner(
    new_owner_principal: Principal,
    name: String,
    role: OwnerRole,
    permissions: Vec<Permission>,
) -> Result<(), Error> {
    let caller = ic_cdk::api::msg_caller();
    
    services::owner::add_owner(&caller, new_owner_principal, name, role, permissions)
        .map_err(|e| e)
}

// Remove an owner (only super admins can do this)
#[update]
pub fn remove_owner(owner_principal: Principal) -> Result<(), Error> {
    let caller = ic_cdk::api::msg_caller();
    
    services::owner::remove_owner(&caller, owner_principal)
        .map_err(|e| e)
}

// Get all owners (only owners can see this)
#[query]
pub fn get_all_owners() -> Result<Vec<Owner>, Error> {
    let caller = ic_cdk::api::msg_caller();
    
    services::owner::get_all_owners(&caller)
        .map_err(|e| e)
}

// Get caller's owner info
#[query]
pub fn get_my_owner_info() -> Result<Owner, Error> {
    let caller = ic_cdk::api::msg_caller();
    
    services::owner::get_owner_info(&caller)
        .map_err(|e| e)
}

// Update owner permissions (only super admins)
#[update]
pub fn update_owner_permissions(
    owner_principal: Principal,
    new_permissions: Vec<Permission>,
) -> Result<(), Error> {
    let caller = ic_cdk::api::msg_caller();
    
    services::owner::update_owner_permissions(&caller, owner_principal, new_permissions)
        .map_err(|e| e)
}

// Check if a principal is an owner
#[query]
pub fn is_owner(principal: Principal) -> bool {
    crate::storage::owner_exists(&principal)
}