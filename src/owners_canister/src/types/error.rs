use candid::CandidType;
use serde::{Deserialize, Serialize};

#[derive(Clone, CandidType, Deserialize, Serialize)]
pub enum Error {
    NotAuthorized(String),
    NotFound(String),
    AlreadyExists(String),
    InvalidInput(String),
    InternalError(String),
}

impl Error {
    pub fn to_string(&self) -> String {
        match self {
            Error::NotAuthorized(msg) => format!("Not authorized: {}", msg),
            Error::NotFound(msg) => format!("Not found: {}", msg),
            Error::AlreadyExists(msg) => format!("Already exists: {}", msg),
            Error::InvalidInput(msg) => format!("Invalid input: {}", msg),
            Error::InternalError(msg) => format!("Internal error: {}", msg),
        }
    }
}