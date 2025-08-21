use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::storable::Bound;
use ic_stable_structures::Storable;
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use std::borrow::Cow;
use std::cell::RefCell;

use candid::{Decode, Encode, Principal};

use crate::types::{comment::Comment, review::Review, tal3a::Tal3a};

type _Memory = VirtualMemory<DefaultMemoryImpl>;

// Implement Storable for Tal3a
impl Storable for Tal3a {
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

// Implement Storable for Comment
impl Storable for Comment {
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
    pub static TAL3AS: RefCell<StableBTreeMap<u64, Tal3a, _Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),
        )
    );

    pub static COMMENTS: RefCell<StableBTreeMap<u64, Comment, _Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1))),
        )
    );

    pub static REVIEWS: RefCell<StableBTreeMap<u64, Review, _Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(2))),
        )
    );

    // ID counters
    pub static NEXT_TAL3A_ID: RefCell<u64> = RefCell::new(1);
    pub static NEXT_COMMENT_ID: RefCell<u64> = RefCell::new(1);
    pub static NEXT_REVIEW_ID: RefCell<u64> = RefCell::new(1);
}
