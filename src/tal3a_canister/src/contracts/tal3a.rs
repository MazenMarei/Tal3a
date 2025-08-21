use crate::types::tal3a::{Tal3a, Tal3aUpdate, CreateTal3aInput};
use candid::Principal;
use ic_cdk::{query, update};

#[update]
fn create_tal3a(group_id: u64, tal3a_data: CreateTal3aInput) -> Result<u64, String> {
    Tal3a::new(group_id, tal3a_data)
}

#[update]
fn update_tal3a(tal3a_id: u64, updated_data: Tal3aUpdate) -> Result<(), String> {
    Tal3a::update(tal3a_id, updated_data)
}

#[update]
fn delete_tal3a(tal3a_id: u64) -> Result<(), String> {
    Tal3a::delete(tal3a_id)
}

#[update]
fn join_tal3a(tal3a_id: u64, user_id: Principal) -> Result<(), String> {
    Tal3a::join(tal3a_id, user_id)
}

#[update]
fn leave_tal3a(tal3a_id: u64, user_id: Principal) -> Result<(), String> {
    Tal3a::leave(tal3a_id, user_id)
}

#[query]
fn get_tal3a(tal3a_id: u64) -> Option<Tal3a> {
    Tal3a::get_by_id(tal3a_id)
}

#[query]
fn get_tal3a_participants(tal3a_id: u64) -> Result<Vec<Principal>, String> {
    Tal3a::get_participants(tal3a_id)
}
