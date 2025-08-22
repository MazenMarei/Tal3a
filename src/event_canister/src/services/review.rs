use crate::storage::{REVIEWS, NEXT_REVIEW_ID, EVENTS};
use crate::types::review::Review;
use ic_cdk::api::time;

impl Review {
    pub fn new(event_id: u64, rating: u8, comment: Option<String>) -> Result<u64, String> {
        let caller = ic_cdk::api::msg_caller();

        // Validate event exists
        let event_exists = EVENTS.with(|events| {
            events.borrow().contains_key(&event_id)
        });

        if !event_exists {
            return Err("Event not found".to_string());
        }

        // Validate rating
        if rating == 0 || rating > 5 {
            return Err("Rating must be between 1 and 5".to_string());
        }

        // Check if user already reviewed this event - simplified for now
        let already_reviewed = false;

        if already_reviewed {
            return Err("User already reviewed this event".to_string());
        }

        let review_id = NEXT_REVIEW_ID.with(|id| {
            let current_id = *id.borrow();
            *id.borrow_mut() = current_id + 1;
            current_id
        });

        let new_review = Review {
            id: review_id,
            event_id,
            user_id: caller,
            rating,
            comment,
            created_at: time(),
        };

        REVIEWS.with(|reviews| {
            reviews.borrow_mut().insert(review_id, new_review);
        });

        Ok(review_id)
    }

    pub fn get_reviews_for_event(_event_id: u64) -> Vec<Review> {
        // For now, return empty vector - will implement proper filtering later
        Vec::new()
    }

    pub fn get_by_id(review_id: u64) -> Option<Review> {
        REVIEWS.with(|reviews| reviews.borrow().get(&review_id))
    }
}
