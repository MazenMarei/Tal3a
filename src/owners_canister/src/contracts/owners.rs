use crate::types::{Owner, OwnerRole, Permission};
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
) -> Result<(), String> {
    let caller = ic_cdk::api::msg_caller();
    
    services::owner::add_owner(&caller, new_owner_principal, name, role, permissions)
        .map_err(|e| e.to_string())
}

// Remove an owner (only super admins can do this)
#[update]
pub fn remove_owner(owner_principal: Principal) -> Result<(), String> {
    let caller = ic_cdk::api::msg_caller();
    
    services::owner::remove_owner(&caller, owner_principal)
        .map_err(|e| e.to_string())
}

// Get all owners (only owners can see this)
#[query]
pub fn get_all_owners() -> Result<Vec<Owner>, String> {
    let caller = ic_cdk::api::msg_caller();
    
    services::owner::get_all_owners(&caller)
        .map_err(|e| e.to_string())
}

// Get caller's owner info
#[query]
pub fn get_my_owner_info() -> Result<Owner, String> {
    let caller = ic_cdk::api::msg_caller();
    
    services::owner::get_owner_info(&caller)
        .map_err(|e| e.to_string())
}

// Update owner permissions (only super admins)
#[update]
pub fn update_owner_permissions(
    owner_principal: Principal,
    new_permissions: Vec<Permission>,
) -> Result<(), String> {
    let caller = ic_cdk::api::msg_caller();
    
    services::owner::update_owner_permissions(&caller, owner_principal, new_permissions)
        .map_err(|e| e.to_string())
}

// Check if a principal is an owner
#[query]
pub fn is_owner(principal: Principal) -> bool {
    crate::storage::owner_exists(&principal)
}

// Get initialization status and super admin info (useful for debugging)
#[query]
pub fn get_initialization_info() -> Result<(Principal, u64), String> {
    let super_admin = crate::storage::get_super_admin()
        .ok_or_else(|| "Canister not properly initialized".to_string())?;
    
    let owners_count = crate::storage::get_all_owners().len() as u64;
    
    Ok((super_admin, owners_count))
}

// Get current caller's principal (useful for testing)
#[query]
pub fn whoami() -> Principal {
    ic_cdk::api::msg_caller()
}