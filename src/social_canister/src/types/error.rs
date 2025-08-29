use candid::CandidType;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]
pub struct Error {
    pub code: u16,
    pub error: String,
    pub message: String,
}
