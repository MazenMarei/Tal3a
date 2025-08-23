use candid::{CandidType, Deserialize};
use ic_stable_structures::{storable::Bound, Storable};
use serde::Serialize;
use std::borrow::Cow;

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct Location {
    pub governorate: String,
    pub city: String,
    pub description: String,
}

impl Storable for Location {
    fn to_bytes(&self) -> Cow<'_, [u8]> {
        Cow::Owned(
            serde_json::to_vec(self).expect("Failed to serialize Location"),
        )
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        serde_json::from_slice(&bytes).expect("Failed to deserialize Location")
    }

    fn into_bytes(self) -> Vec<u8> {
        serde_json::to_vec(&self).expect("Failed to serialize Location")
    }

    const BOUND: Bound = Bound::Unbounded;
}
