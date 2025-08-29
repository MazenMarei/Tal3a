use crate::types::error::Error;
use crate::types::posts::{NewPost, Post, UpdatePost};
use candid::Principal;
use ic_cdk;
use ic_cdk::api::msg_caller;
use ic_cdk::{query, update};

#[update]
pub async fn create_post(new_post: NewPost) -> Result<Post, Error> {
    Post::new(new_post).await
}

#[query]
pub async fn get_post(post_id: &str) -> Result<Post, Error> {
    Post::get_by_id(post_id)
}

#[query]
pub async fn get_posts_by_user(user_id: Principal) -> Vec<Post> {
    Post::get_user_posts(user_id)
}

#[query]
pub async fn get_current_user_posts() -> Vec<Post> {
    let user_id = msg_caller();
    Post::get_user_posts(user_id)
}

#[query]
pub async fn get_unseen_posts() -> Vec<Post> {
    let user_id = msg_caller();
    Post::get_unseen_posts(user_id)
}

#[update]
pub async fn mark_post_as_read(post_id: &str) -> Result<(), Error> {
    let user_id = msg_caller();
    Post::get_by_id(post_id)?.mark_as_read(user_id)
}

#[update]
pub async fn update_post(post_id: &str, updated_post: UpdatePost) -> Result<Post, Error> {
    Post::update(post_id, updated_post)
}

#[update]
pub async fn delete_post(post_id: &str) -> Result<(), Error> {
    Post::delete(post_id)
}
