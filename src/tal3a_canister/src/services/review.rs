use crate::storage::{REVIEWS, NEXT_REVIEW_ID, TAL3AS};
use crate::types::review::Review;
use candid::Principal;
use ic_cdk::api::time;

impl Review {
    pub fn new(tal3a_id: u64, rating: u8, comment: Option<String>) -> Result<u64, String> {
        let caller = ic_cdk::api::msg_caller();

        // Validate tal3a exists
        let tal3a_exists = TAL3AS.with(|tal3as| {
            tal3as.borrow().contains_key(&tal3a_id)
        });

        if !tal3a_exists {
            return Err("Tal3a not found".to_string());
        }

        // Validate rating
        if rating == 0 || rating > 5 {
            return Err("Rating must be between 1 and 5".to_string());
        }

        // Check if user already reviewed this tal3a
        let already_reviewed = REVIEWS.with(|reviews| {
            for (_, review) in reviews.borrow().iter() {
                if review.tal3a_id == tal3a_id && review.reviewer_id == caller {
                    return true;
                }
            }
            false
        });

        if already_reviewed {
            return Err("User already reviewed this tal3a".to_string());
        }

        let review_id = NEXT_REVIEW_ID.with(|id| {
            let current_id = *id.borrow();
            *id.borrow_mut() = current_id + 1;
            current_id
        });

        let new_review = Review {
            id: review_id,
            tal3a_id,
            reviewer_id: caller,
            rating,
            comment,
            created_at: time(),
        };

        REVIEWS.with(|reviews| {
            reviews.borrow_mut().insert(review_id, new_review);
        });

        Ok(review_id)
    }

    pub fn get_reviews_for_tal3a(tal3a_id: u64) -> Vec<Review> {
        REVIEWS.with(|reviews| {
            reviews
                .borrow()
                .iter()
                .filter_map(|(_, review)| {
                    if review.tal3a_id == tal3a_id {
                        Some(review)
                    } else {
                        None
                    }
                })
                .collect()
        })
    }

    pub fn get_by_id(review_id: u64) -> Option<Review> {
        REVIEWS.with(|reviews| reviews.borrow().get(&review_id))
    }
}
