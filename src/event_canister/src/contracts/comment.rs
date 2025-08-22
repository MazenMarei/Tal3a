use crate::types::comment::Comment;
use ic_cdk::{query, update};

#[update]
fn comment_on_event(
    event_id: u64,
    content: String,
    parent_comment_id: Option<u64>,
) -> Result<Comment, String> {
    Comment::new(event_id, content, parent_comment_id)
}

#[query]
fn get_event_comments(event_id: u64) -> Vec<Comment> {
    Comment::get_comments_for_event(event_id)
}

#[query]
fn get_comment(comment_id: u64) -> Option<Comment> {
    Comment::get_by_id(comment_id)
}

#[update]
fn update_comment(comment_id: u64, new_content: String) -> Result<(), String> {
    Comment::update_content(comment_id, new_content)
}

#[update]
fn delete_comment(comment_id: u64) -> Result<(), String> {
    Comment::delete(comment_id)
}
