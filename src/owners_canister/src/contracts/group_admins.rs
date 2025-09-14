use crate::types::{GroupAdmin, GroupPermission};
use crate::services;
use candid::Principal;
use ic_cdk::{query, update};

// Add a group admin
#[update]
pub fn add_group_admin(
    group_id: u64,
    admin_principal: Principal,
    name: String,
    permissions: Vec<GroupPermission>,
) -> Result<(), String> {
    let caller = ic_cdk::api::caller();
    
    services::group_admin::add_group_admin(&caller, group_id, admin_principal, name, permissions)
        .map_err(|e| e.to_string())
}

// Remove a group admin
#[update]
pub fn remove_group_admin(group_id: u64, admin_principal: Principal) -> Result<(), String> {
    let caller = ic_cdk::api::caller();
    
    services::group_admin::remove_group_admin(&caller, group_id, admin_principal)
        .map_err(|e| e.to_string())
}

// Get group admins for a specific group
#[query]
pub fn get_group_admins(group_id: u64) -> Result<Vec<GroupAdmin>, String> {
    let caller = ic_cdk::api::caller();
    
    services::group_admin::get_group_admins(&caller, group_id)
        .map_err(|e| e.to_string())
}

// Get caller's group admin info for all groups
#[query]
pub fn get_my_group_admin_info() -> Vec<GroupAdmin> {
    let caller = ic_cdk::api::caller();
    
    services::group_admin::get_user_group_admin_info(&caller)
}

// Update group admin permissions
#[update]
pub fn update_group_admin_permissions(
    group_id: u64,
    admin_principal: Principal,
    new_permissions: Vec<GroupPermission>,
) -> Result<(), String> {
    let caller = ic_cdk::api::caller();
    
    services::group_admin::update_group_admin_permissions(&caller, group_id, admin_principal, new_permissions)
        .map_err(|e| e.to_string())
}

// Check if a principal is a group admin
#[query]
pub fn is_group_admin(group_id: u64, principal: Principal) -> bool {
    services::group_admin::is_group_admin(group_id, &principal)
}