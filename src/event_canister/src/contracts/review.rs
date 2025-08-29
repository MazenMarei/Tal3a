use crate::types::error::Error;
use crate::types::review::Review;
use ic_cdk::{query, update};

#[update]
async fn review_event(event_id: u64, rating: u8, comment: Option<String>) -> Result<u64, Error> {
    Review::new(event_id, rating, comment).await
}

#[query]
fn get_event_reviews(event_id: u64) -> Vec<Review> {
    Review::get_reviews_for_event(event_id)
}

#[query]
fn get_review(review_id: u64) -> Option<Review> {
    Review::get_by_id(review_id)
}
