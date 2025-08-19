use crate::types::user::{RegisteringUser, UpdatingUser, User};
use candid::Principal;
use ic_cdk;
use ic_cdk::{query, update};

#[query]
fn get_user(principal_id: Principal) -> Result<User, String> {
    User::get_user(principal_id).map_err(|e| e.to_string())
}

#[query]
fn get_current_user() -> Result<User, String> {
    User::get_user(ic_cdk::api::msg_caller()).map_err(|_| "User not found".into())
}

#[update]
fn create_user(new_user: RegisteringUser) -> Result<User, String> {
    User::new(new_user).map_err(|e| e.to_string())
}

#[update]
fn update_profile(new_data: UpdatingUser) -> Result<(), String> {
    let caller = ic_cdk::api::msg_caller();
    let user = User::get_user(caller).ok();
    if let Some(mut user) = user {
        user.update(new_data).map_err(|e| e.to_string())
    } else {
        Err("User not found".into())
    }
}

#[update]
fn delete_account() -> Result<(), String> {
    let caller = ic_cdk::api::msg_caller();
    let user = User::get_user(caller).ok();
    if let Some(user) = user {
        user.delete().map_err(|e| e.to_string())
    } else {
        Err("User not found".into())
    }
}

#[update]
fn set_account_status(new_status: bool) -> Result<(), String> {
    let caller = ic_cdk::api::msg_caller();
    let user = User::get_user(caller).ok();
    if let Some(mut user) = user {
        user.set_status(new_status).map_err(|e| e.to_string())
    } else {
        Err("User not found".into())
    }
}

#[update]
fn join_group(group_id: u64) -> Result<(), String> {
    let caller = ic_cdk::api::msg_caller();
    let user = User::get_user(caller).ok();
    if let Some(mut user) = user {
        //TODO - check if group exists and id is valid , getting group details
        user.join_group(group_id).map_err(|e| e.to_string())
    } else {
        Err("User not found".into())
    }
}

#[update]
fn join_tal3a(tal3a_id: u64) -> Result<(), String> {
    let caller = ic_cdk::api::msg_caller();
    let user = User::get_user(caller).ok();
    if let Some(mut user) = user {
        //TODO - check if Tal3a exists and id is valid , getting Tal3a details
        //TODO - check if user is already a member of the Tal3a
        //TODO - check if user is already in the Tal3a Group
        user.join_tal3a(tal3a_id).map_err(|e| e.to_string())
    } else {
        Err("User not found".into())
    }
}

#[update]
fn leave_group(group_id: u64) -> Result<(), String> {
    let caller = ic_cdk::api::msg_caller();
    let user = User::get_user(caller).ok();
    if let Some(mut user) = user {
        //TODO - check if group exists and id is valid , getting group details
        //TODO - check if user is already a member of the group
        user.leave_group(group_id).map_err(|e| e.to_string())
    } else {
        Err("User not found".into())
    }
}

#[update]
fn leave_tal3a(tal3a_id: u64) -> Result<(), String> {
    let caller = ic_cdk::api::msg_caller();
    let user = User::get_user(caller).ok();
    if let Some(mut user) = user {
        //TODO - check if Tal3a exists and id is valid , getting Tal3a details
        //TODO - check if user is already a member of the Tal3a
        user.leave_tal3a(tal3a_id).map_err(|e| e.to_string())
    } else {
        Err("User not found".into())
    }
}
