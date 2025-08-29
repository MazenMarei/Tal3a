use crate::storage::{ReviewIds, EVENTS, EVENT_REVIEWS, REVIEWS};
use crate::types::error::Error;
use crate::types::review::Review;
use crate::utils::generate_unique_id;
use ic_cdk::api::time;

impl Review {
    pub async fn new(event_id: u64, rating: u8, comment: Option<String>) -> Result<u64, Error> {
        let caller = ic_cdk::api::msg_caller();

        // Validate event exists
        let event_exists = EVENTS.with(|events| events.borrow().contains_key(&event_id));

        if !event_exists {
            return Err(Error {
                code: 404,
                error: "Event not found".to_string(),
                message: "No event found with the given ID".to_string(),
            });
        }

        // Validate rating
        if rating == 0 || rating > 5 {
            return Err(Error {
                code: 400,
                error: "Invalid rating".to_string(),
                message: "Rating must be between 1 and 5".to_string(),
            });
        }

        // Check if user already reviewed this event
        let mut already_reviewed = false;

        REVIEWS.with(|reviews| {
            already_reviewed = reviews
                .borrow()
                .values()
                .any(|r| r.event_id == event_id && r.user_id == caller);
        });

        if already_reviewed {
            return Err(Error {
                code: 409,
                error: "Conflict".to_string(),
                message: "User already reviewed this event".to_string(),
            });
        }

        let review_id = generate_unique_id().await;

        let new_review = Review {
            id: review_id,
            event_id,
            user_id: caller,
            rating,
            comment,
            created_at: time(),
        };

        // Store the review
        REVIEWS.with(|reviews| {
            reviews.borrow_mut().insert(review_id, new_review);
        });

        // Update the event -> reviews index
        EVENT_REVIEWS.with(|event_reviews| {
            let mut borrowed = event_reviews.borrow_mut();
            match borrowed.get(&event_id) {
                Some(mut review_ids) => {
                    review_ids.0.push(review_id);
                    borrowed.insert(event_id, review_ids);
                }
                None => {
                    borrowed.insert(event_id, ReviewIds(vec![review_id]));
                }
            }
        });

        Ok(review_id)
    }

    pub fn get_reviews_for_event(event_id: u64) -> Vec<Review> {
        EVENT_REVIEWS.with(
            |event_reviews| match event_reviews.borrow().get(&event_id) {
                Some(review_ids) => REVIEWS.with(|reviews| {
                    let borrowed_reviews = reviews.borrow();
                    review_ids
                        .0
                        .iter()
                        .filter_map(|&id| borrowed_reviews.get(&id))
                        .collect()
                }),
                None => Vec::new(),
            },
        )
    }

    pub fn get_by_id(review_id: u64) -> Option<Review> {
        REVIEWS.with(|reviews| reviews.borrow().get(&review_id))
    }
}
