use crate::types::{Owner, GroupAdmin};
use candid::Principal;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap, Storable};
use ic_stable_structures::storable::Bound;
use std::cell::RefCell;
use std::borrow::Cow;

// Type alias for virtual memory
type Memory = VirtualMemory<DefaultMemoryImpl>;

// Implementing Storable trait for Owner
impl Storable for Owner {
    fn to_bytes(&self) -> Cow<'_, [u8]> {
        let json = serde_json::to_string(self).unwrap();
        Cow::Owned(json.into_bytes())
    }

    fn into_bytes(self) -> Vec<u8> {
        let json = serde_json::to_string(&self).unwrap();
        json.into_bytes()
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        let json = String::from_utf8(bytes.to_vec()).unwrap();
        serde_json::from_str(&json).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

// Implementing Storable trait for GroupAdmin
impl Storable for GroupAdmin {
    fn to_bytes(&self) -> Cow<'_, [u8]> {
        let json = serde_json::to_string(self).unwrap();
        Cow::Owned(json.into_bytes())
    }

    fn into_bytes(self) -> Vec<u8> {
        let json = serde_json::to_string(&self).unwrap();
        json.into_bytes()
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        let json = String::from_utf8(bytes.to_vec()).unwrap();
        serde_json::from_str(&json).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

// Thread-local storage for managing canister state
thread_local! {
    // Memory manager for handling stable storage
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    // Stable BTree map for storing platform owners
    static OWNERS: RefCell<StableBTreeMap<Principal, Owner, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(50))), // Memory ID 50 for Owners
        )
    );

    // Stable BTree map for storing group admins (key: group_id_principal)
    static GROUP_ADMINS: RefCell<StableBTreeMap<String, GroupAdmin, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(51))), // Memory ID 51 for Group Admins
        )
    );

    // Store the initial super admin principal
    static SUPER_ADMIN: RefCell<Option<Principal>> = RefCell::new(None);
}

// Storage functions for owners
pub fn get_owner(principal: &Principal) -> Option<Owner> {
    OWNERS.with(|owners| owners.borrow().get(principal))
}

pub fn insert_owner(owner: Owner) {
    OWNERS.with(|owners| {
        owners.borrow_mut().insert(owner.principal, owner);
    });
}

pub fn remove_owner(principal: &Principal) -> bool {
    OWNERS.with(|owners| {
        owners.borrow_mut().remove(principal).is_some()
    })
}

pub fn get_all_owners() -> Vec<Owner> {
    OWNERS.with(|owners| {
        owners.borrow().iter().map(|entry| entry.value()).collect()
    })
}

pub fn owner_exists(principal: &Principal) -> bool {
    OWNERS.with(|owners| owners.borrow().contains_key(principal))
}

// Storage functions for group admins
pub fn get_group_admin(group_id: u64, principal: &Principal) -> Option<GroupAdmin> {
    let key = format!("{}_{}", group_id, principal.to_text());
    GROUP_ADMINS.with(|admins| admins.borrow().get(&key))
}

pub fn insert_group_admin(admin: GroupAdmin) {
    let key = format!("{}_{}", admin.group_id, admin.principal.to_text());
    GROUP_ADMINS.with(|admins| {
        admins.borrow_mut().insert(key, admin);
    });
}

pub fn remove_group_admin(group_id: u64, principal: &Principal) -> bool {
    let key = format!("{}_{}", group_id, principal.to_text());
    GROUP_ADMINS.with(|admins| {
        admins.borrow_mut().remove(&key).is_some()
    })
}

pub fn get_group_admins_for_group(group_id: u64) -> Vec<GroupAdmin> {
    GROUP_ADMINS.with(|admins| {
        admins.borrow().iter()
            .filter_map(|entry| {
                let admin = entry.value();
                if admin.group_id == group_id {
                    Some(admin)
                } else {
                    None
                }
            })
            .collect()
    })
}

pub fn get_user_group_admins(principal: &Principal) -> Vec<GroupAdmin> {
    GROUP_ADMINS.with(|admins| {
        admins.borrow().iter()
            .filter_map(|entry| {
                let admin = entry.value();
                if admin.principal == *principal {
                    Some(admin)
                } else {
                    None
                }
            })
            .collect()
    })
}

pub fn group_admin_exists(group_id: u64, principal: &Principal) -> bool {
    let key = format!("{}_{}", group_id, principal.to_text());
    GROUP_ADMINS.with(|admins| admins.borrow().contains_key(&key))
}

// Super admin functions
pub fn set_super_admin(principal: Principal) {
    SUPER_ADMIN.with(|admin| {
        *admin.borrow_mut() = Some(principal);
    });
}

pub fn get_super_admin() -> Option<Principal> {
    SUPER_ADMIN.with(|admin| *admin.borrow())
}

pub fn count_super_admins() -> usize {
    OWNERS.with(|owners| {
        owners.borrow().iter().filter(|entry| {
            let owner = entry.value();
            owner.role == crate::types::OwnerRole::SuperAdmin
        }).count()
    })
}