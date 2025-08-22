use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]

pub struct Post {


    pub group_id: String,
    pub post_id: String, // should be a unique identifier randomly generated
    pub author: Principal,

    pub content: String,
    pub images: Vec<Vec<u8>>,
    pub created_at: u64,
    pub updated_at: u64,

}
