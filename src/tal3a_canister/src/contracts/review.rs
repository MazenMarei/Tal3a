use crate::types::review::Review;
use ic_cdk::{query, update};

#[update]
fn review_tal3a(tal3a_id: u64, rating: u8, comment: Option<String>) -> Result<u64, String> {
    Review::new(tal3a_id, rating, comment)
}

#[query]
fn get_tal3a_reviews(tal3a_id: u64) -> Vec<Review> {
    Review::get_reviews_for_tal3a(tal3a_id)
}

#[query]
fn get_review(review_id: u64) -> Option<Review> {
    Review::get_by_id(review_id)
}
