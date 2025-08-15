use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory };
use ic_stable_structures::Storable;
use ic_stable_structures::storable::Bound;

use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use std::cell::RefCell;
use std::borrow::Cow;

use candid::Principal;

use crate::types::User;
use candid::{Encode, Decode};

type Memory = VirtualMemory<DefaultMemoryImpl>;


// Implement the `Storable` trait for the `User` struct.
// convert the `User` struct to bytes to be `Storable` stored in stable memory
impl Storable for User {
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

    // Initialize a `StableBTreeMap` with `MemoryId(0)`.
    pub static USERS: RefCell<StableBTreeMap<Principal, User, Memory>> = RefCell::new(
        StableBTreeMap::init( 
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),
        )
    );
    pub static NEXT_ID: RefCell<u64> = RefCell::new(1);
}