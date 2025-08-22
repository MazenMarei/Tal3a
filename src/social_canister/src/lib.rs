pub mod contracts;
pub mod services;
pub mod storage;
pub mod types;
pub mod utils;

use candid::Principal;
use ic_cdk;

use crate::types::{
    group::{CreatingGroup, Group, GroupFilter},
    group_members::GroupMember,
    posts::{NewPost, Post, UpdatePost},
};

// * export contracts
ic_cdk::export_candid!();
