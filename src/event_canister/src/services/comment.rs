use crate::storage::{COMMENTS, NEXT_COMMENT_ID, EVENTS};
use crate::types::comment::Comment;
use candid::Principal;
use ic_cdk::api::time;

impl Comment {
    pub fn new(
        event_id: u64,
        content: String,
        parent_comment_id: Option<u64>,
    ) -> Result<Comment, String> {
        let caller = ic_cdk::api::msg_caller();

        // Validate event exists
        let event_exists = EVENTS.with(|events| {
            events.borrow().contains_key(&event_id)
        });

        if !event_exists {
            return Err("Event not found".to_string());
        }

        // Validate content
        if content.trim().is_empty() {
            return Err("Comment content cannot be empty".to_string());
        }

        if content.len() > 500 {
            return Err("Comment content too long (max 500 characters)".to_string());
        }

        // Validate parent comment if provided
        if let Some(parent_id) = parent_comment_id {
            let parent_exists = COMMENTS.with(|comments| {
                if let Some(parent_comment) = comments.borrow().get(&parent_id) {
                    parent_comment.event_id == event_id
                } else {
                    false
                }
            });

            if !parent_exists {
                return Err("Parent comment not found or not in same event".to_string());
            }
        }

        let comment_id = NEXT_COMMENT_ID.with(|id| {
            let current_id = *id.borrow();
            *id.borrow_mut() = current_id + 1;
            current_id
        });

        let new_comment = Comment {
            id: comment_id,
            event_id,
            author_id: caller,
            content,
            parent_comment_id,
            created_at: time(),
            updated_at: None,
        };

        COMMENTS.with(|comments| {
            comments.borrow_mut().insert(comment_id, new_comment.clone());
        });

        Ok(new_comment)
    }

    pub fn get_comments_for_event(_event_id: u64) -> Vec<Comment> {
        // For now, return empty vector - will implement proper filtering later
        Vec::new()
    }

    pub fn get_by_id(comment_id: u64) -> Option<Comment> {
        COMMENTS.with(|comments| comments.borrow().get(&comment_id))
    }

    pub fn update_content(comment_id: u64, new_content: String) -> Result<(), String> {
        let caller = ic_cdk::api::msg_caller();

        // Validate content
        if new_content.trim().is_empty() {
            return Err("Comment content cannot be empty".to_string());
        }

        if new_content.len() > 500 {
            return Err("Comment content too long (max 500 characters)".to_string());
        }

        COMMENTS.with(|comments| {
            let mut comments_map = comments.borrow_mut();

            if let Some(mut comment) = comments_map.get(&comment_id) {
                // Check if caller is the author
                if comment.author_id != caller {
                    return Err("Only author can update comment".to_string());
                }

                comment.content = new_content;
                comment.updated_at = Some(time());
                comments_map.insert(comment_id, comment);
                Ok(())
            } else {
                Err("Comment not found".to_string())
            }
        })
    }

    pub fn delete(comment_id: u64) -> Result<(), String> {
        let caller = ic_cdk::api::msg_caller();

        COMMENTS.with(|comments| {
            let mut comments_map = comments.borrow_mut();

            if let Some(comment) = comments_map.get(&comment_id) {
                // Check if caller is the author
                if comment.author_id != caller {
                    return Err("Only author can delete comment".to_string());
                }

                comments_map.remove(&comment_id);
                Ok(())
            } else {
                Err("Comment not found".to_string())
            }
        })
    }
}
