use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::storable::Bound;
use ic_stable_structures::Storable;
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use std::borrow::Cow;
use std::cell::RefCell;

use candid::{Decode, Encode};

use crate::types::{review::Review, event::Event};

// Wrapper for Vec<u64> to make it Storable
#[derive(Clone, Debug)]
pub struct ReviewIds(pub Vec<u64>);

impl Storable for ReviewIds {
    fn to_bytes(&self) -> Cow<'_, [u8]> {
        Cow::Owned(Encode!(&self.0).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        ReviewIds(Decode!(bytes.as_ref(), Vec<u64>).unwrap_or_default())
    }

    const BOUND: Bound = Bound::Unbounded;

    fn into_bytes(self) -> Vec<u8> {
        Encode!(&self.0).unwrap()
    }
}

type _Memory = VirtualMemory<DefaultMemoryImpl>;

// Implement Storable for Event
impl Storable for Event {
    fn to_bytes(&self) -> Cow<'_, [u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;

    fn into_bytes(self) -> Vec<u8> {
        Encode!(&self).unwrap()
    }
}

// Implement Storable for Review
impl Storable for Review {
    fn to_bytes(&self) -> Cow<'_, [u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;

    fn into_bytes(self) -> Vec<u8> {
        Encode!(&self).unwrap()
    }
}

// Thread-local storage for the memory manager
thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    // Initialize StableBTreeMaps
    pub static EVENTS: RefCell<StableBTreeMap<u64, Event, _Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),
        )
    );

    pub static REVIEWS: RefCell<StableBTreeMap<u64, Review, _Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1))),
        )
    );

    // Map event_id -> list of review_ids for efficient lookups
    pub static EVENT_REVIEWS: RefCell<StableBTreeMap<u64, ReviewIds, _Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(2))),
        )
    );

    // Store all event IDs for efficient iteration
    pub static ALL_EVENT_IDS: RefCell<StableBTreeMap<u64, ReviewIds, _Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(3))),
        )
    );

    // ID counters - only for events now (reviews use unique IDs)
    pub static NEXT_EVENT_ID: RefCell<u64> = RefCell::new(1);
}
