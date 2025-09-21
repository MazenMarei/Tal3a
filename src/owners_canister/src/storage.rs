use crate::types::{AdminRequest, GroupAdmin, Owner};
use candid::Principal;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::storable::Bound;
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap, Storable};
use std::borrow::Cow;
use std::cell::RefCell;

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

// Implementing Storable trait for AdminRequest
impl Storable for AdminRequest {
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

    // Stable BTree map for storing admin requests (key: request_id)
    static ADMIN_REQUESTS: RefCell<StableBTreeMap<String, AdminRequest, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(52))), // Memory ID 52 for Admin Requests
        )
    );

    // Store principals who have already made admin requests (one per user)
    pub static REQUEST_PRINCIPALS: RefCell<StableBTreeMap<Principal, bool, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(53))), // Memory ID 53 for Request Principals
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
    OWNERS.with(|owners| owners.borrow_mut().remove(principal).is_some())
}

pub fn get_all_owners() -> Vec<Owner> {
    OWNERS.with(|owners| owners.borrow().iter().map(|entry| entry.value()).collect())
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
    GROUP_ADMINS.with(|admins| admins.borrow_mut().remove(&key).is_some())
}

pub fn get_group_admins_for_group(group_id: u64) -> Vec<GroupAdmin> {
    GROUP_ADMINS.with(|admins| {
        admins
            .borrow()
            .iter()
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
        admins
            .borrow()
            .iter()
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
        owners
            .borrow()
            .iter()
            .filter(|entry| {
                let owner = entry.value();
                owner.role == crate::types::OwnerRole::SuperAdmin
            })
            .count()
    })
}

// Admin request storage functions
pub fn get_admin_request(request_id: &str) -> Option<AdminRequest> {
    ADMIN_REQUESTS.with(|requests| requests.borrow().get(&request_id.to_string()))
}

pub fn insert_admin_request(request: AdminRequest) {
    ADMIN_REQUESTS.with(|requests| {
        requests.borrow_mut().insert(request.id.clone(), request);
    });
}

pub fn remove_admin_request(request_id: &str) -> bool {
    ADMIN_REQUESTS.with(|requests| {
        requests
            .borrow_mut()
            .remove(&request_id.to_string())
            .is_some()
    })
}

pub fn update_admin_request(request: AdminRequest) {
    ADMIN_REQUESTS.with(|requests| {
        requests.borrow_mut().insert(request.id.clone(), request);
    });
}

pub fn get_all_admin_requests() -> Vec<AdminRequest> {
    ADMIN_REQUESTS.with(|requests| {
        requests
            .borrow()
            .iter()
            .map(|entry| entry.value())
            .collect()
    })
}

pub fn get_pending_admin_requests() -> Vec<AdminRequest> {
    ADMIN_REQUESTS.with(|requests| {
        requests
            .borrow()
            .iter()
            .filter_map(|entry| {
                let request = entry.value();
                if request.status == crate::types::AdminRequestStatus::Pending {
                    Some(request)
                } else {
                    None
                }
            })
            .collect()
    })
}

pub fn has_requested_admin_access(principal: &Principal) -> bool {
    REQUEST_PRINCIPALS.with(|principals| principals.borrow().contains_key(principal))
}

pub fn mark_principal_requested(principal: Principal) {
    REQUEST_PRINCIPALS.with(|principals| {
        principals.borrow_mut().insert(principal, true);
    });
}

pub fn unmark_principal_requested(principal: &Principal) -> bool {
    REQUEST_PRINCIPALS.with(|principals| principals.borrow_mut().remove(principal).is_some())
}