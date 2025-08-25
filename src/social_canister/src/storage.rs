use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::storable::Bound;
use ic_stable_structures::Storable;

use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use std::borrow::Cow;
use std::cell::RefCell;

use candid::Principal;

use crate::types::likes::Likes;
use crate::types::{comments, group, group_members, likes, posts, tal3a, tal3a_members};

use candid::{Decode, Encode};

type _Memory = VirtualMemory<DefaultMemoryImpl>;

// * Implement the `Storable` trait for the structs.
// * convert structs to bytes to be `Storable` stored in stable memory
impl Storable for comments::Comments {
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

impl Storable for group::Group {
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

impl Storable for group_members::GroupMembers {
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

impl Storable for likes::Likes {
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

impl Storable for tal3a::Tal3a {
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

impl Storable for posts::Post {
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

impl Storable for tal3a_members::Tal3aMembers {
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

#[derive(Clone, Debug, PartialEq, Eq, candid::CandidType, candid::Deserialize)]
pub struct StringVec(pub Vec<String>);

impl Storable for StringVec {
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

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    // *  Primary stores
    pub static GROUPS: RefCell<StableBTreeMap<String, group::Group, _Memory>> =
        RefCell::new(
            StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get( MemoryId::new(0))),
        ));

    pub static POSTS: RefCell<StableBTreeMap<String, posts::Post, _Memory>> =
        RefCell::new(
            StableBTreeMap::init(
                MEMORY_MANAGER.with(|m| m.borrow().get( MemoryId::new(1))),
            )
        );

    pub static COMMENTS: RefCell<StableBTreeMap<String, comments::Comments, _Memory>> =
        RefCell::new(
            StableBTreeMap::init(
                MEMORY_MANAGER.with(|m| m.borrow().get( MemoryId::new(2))),
            )
        );


    pub static TAL3A: RefCell<StableBTreeMap<String, tal3a::Tal3a, _Memory>> =
        RefCell::new(
            StableBTreeMap::init(
                MEMORY_MANAGER.with(|m| m.borrow().get( MemoryId::new(4))),
            )
        );

    pub static GROUP_MEMBERS: RefCell<StableBTreeMap<String, group_members::GroupMembers, _Memory>> =
        RefCell::new(
            StableBTreeMap::init(
                MEMORY_MANAGER.with(|m| m.borrow().get( MemoryId::new(5))),
            )
        );

    pub static TAL3A_MEMBERS: RefCell<StableBTreeMap<String, tal3a_members::Tal3aMembers, _Memory>> =
        RefCell::new(
            StableBTreeMap::init(
                MEMORY_MANAGER.with(|m| m.borrow().get( MemoryId::new(6))),
            )
        );
    // * Secondary stores for indexing

    pub static POSTS_BY_GROUP: RefCell<StableBTreeMap<String, StringVec, _Memory>> =
        RefCell::new(
            StableBTreeMap::init(
                MEMORY_MANAGER.with(|m| m.borrow().get( MemoryId::new(7))),
            )
        );

    pub static POSTS_BY_USER: RefCell<StableBTreeMap<Principal, StringVec, _Memory>> =
        RefCell::new(
            StableBTreeMap::init(
                MEMORY_MANAGER.with(|m| m.borrow().get( MemoryId::new(8))),
            )
    );

    pub static COMMENTS_BY_POST: RefCell<StableBTreeMap<String, StringVec, _Memory>> =
        RefCell::new(
            StableBTreeMap::init(
                MEMORY_MANAGER.with(|m| m.borrow().get( MemoryId::new(9))),
            )
        );

    pub static COMMENTS_BY_USER: RefCell<StableBTreeMap<Principal, StringVec, _Memory>> =
        RefCell::new(
            StableBTreeMap::init(
                MEMORY_MANAGER.with(|m| m.borrow().get( MemoryId::new(10))),
            )
        );

    pub static LIKES_BY_POST: RefCell<StableBTreeMap<String, Likes, _Memory>> = 
        RefCell::new(
            StableBTreeMap::init(
                MEMORY_MANAGER.with(|m| m.borrow().get( MemoryId::new(11))),
            )
        );

    pub static LIKES_BY_USER: RefCell<StableBTreeMap<Principal, Likes, _Memory>> = 
        RefCell::new(
            StableBTreeMap::init(
                MEMORY_MANAGER.with(|m| m.borrow().get( MemoryId::new(12))),
            )
        );

        
    pub static GROUPS_BY_USER: RefCell<StableBTreeMap<Principal, StringVec, _Memory>> =
        RefCell::new(
            StableBTreeMap::init(
                MEMORY_MANAGER.with(|m| m.borrow().get( MemoryId::new(13))),
            )
        );

    pub static TAL3A_BY_GROUP: RefCell<StableBTreeMap<String, StringVec, _Memory>> =
        RefCell::new(
            StableBTreeMap::init(
                MEMORY_MANAGER.with(|m| m.borrow().get( MemoryId::new(14))),
            )
        );

    pub static TAL3A_BY_USER: RefCell<StableBTreeMap<Principal, StringVec, _Memory>> =
        RefCell::new(
            StableBTreeMap::init(
                MEMORY_MANAGER.with(|m| m.borrow().get( MemoryId::new(15))),
            )
        );

    pub static UNSEEN_POSTS: RefCell<StableBTreeMap<Principal, StringVec, _Memory>> =
        RefCell::new(
            StableBTreeMap::init(
                MEMORY_MANAGER.with(|m| m.borrow().get( MemoryId::new(16))),
            )
        );

}
