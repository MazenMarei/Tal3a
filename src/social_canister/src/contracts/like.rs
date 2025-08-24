use ic_cdk;
use ic_cdk::api::msg_caller;
use ic_cdk::{query, update};

use crate::types::likes::{Like, LikeTarget};

#[update]
pub fn like(like: LikeTarget) -> Result<(), String> {
    let user_id = msg_caller();
    Like::new(Like {
        target: like,
        user_id,
        liked_at: ic_cdk::api::time(),
    })
}

#[update]
pub fn unlike(like: LikeTarget) -> Result<(), String> {
    let user_id = msg_caller();
    Like::delete(like, user_id)
}
