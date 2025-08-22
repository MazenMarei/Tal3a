use crate::types::group::{CreatingGroup, Group, GroupFilter};
use crate::types::group_members::GroupMember;
use crate::types::posts::Post;
use candid::Principal;
use ic_cdk;
use ic_cdk::api::msg_caller;
use ic_cdk::{query, update};

#[update]
pub async fn create_group(new_group: CreatingGroup) -> Result<Group, String> {
    Group::new(new_group).await
}

#[query]
pub fn get_group(group_id: &str) -> Result<Group, String> {
    Group::get_by_id(group_id)
}

#[query]
pub fn filter_groups(filter: GroupFilter) -> Vec<Group> {
    Group::filter_groups(filter)
}

#[query]
pub fn get_sub_clubs(group_id: &str) -> Vec<Group> {
    match Group::get_by_id(group_id) {
        Ok(group) => group.get_sub_clubs(),
        Err(_) => Vec::new(),
    }
}

#[query]
pub fn get_sub_club(group_id: &str, club_id: &str) -> Vec<Group> {
    match Group::get_by_id(group_id) {
        Ok(group) => group.get_sub_club(club_id),
        Err(_) => Vec::new(),
    }
}

#[query]
pub fn get_group_members(group_id: &str) -> Vec<GroupMember> {
    Group::get_members(group_id)
}

#[update]
pub async fn join_group(group_id: &str) -> Result<(), String> {
    let user = msg_caller();
    let group = Group::get_by_id(group_id)?;
    group.join(user).await
}

#[update]
pub fn leave_group(group_id: &str) -> Result<(), String> {
    let user = msg_caller();
    let group = Group::get_by_id(group_id)?;
    group.leave(user)
}

#[query]
pub fn get_member_groups(user: Principal) -> Vec<Group> {
    Group::get_member_groups(user)
}

#[query]
pub fn get_group_posts(group_id: &str) -> Vec<Post> {
    match Group::get_by_id(group_id) {
        Ok(group) => group.get_posts(),
        Err(_) => Vec::new(),
    }
}

#[update]
pub fn delete_group(group_id: &str) -> Result<(), String> {
    let group = Group::get_by_id(group_id)?;
    group.delete()
}
