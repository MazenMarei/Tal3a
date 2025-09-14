// Import statements for Candid, IC CDK, and stable structures
use candid::Principal;
use ic_cdk::{query, update};
use ic_cdk;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory };
use ic_stable_structures::Storable;
use ic_stable_structures::storable::Bound;
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use std::cell::RefCell;
use std::borrow::Cow;
use serde::{Deserialize, Serialize};
use candid::CandidType;

// Module declarations for different canisters
pub mod post_canister;
pub mod event_canister;

// Re-export types for Candid interface
pub use post_canister::{Post, Comment};
pub use event_canister::{Tal3a, Review, EventComment, Location, EventStatus, Tal3aUpdate, Coordinates};

// Type alias for virtual memory
type Memory = VirtualMemory<DefaultMemoryImpl>;

// User struct representing a platform user
#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct User {
    pub id: u64,                      // Unique user identifier
    pub user_principal: Principal,    // Internet Computer principal ID
    pub email: Option<String>,        // User's email address (optional)
    pub name: String,                 // User's display name
    pub avatar_url: Option<String>,   // URL to user's avatar image (optional)
}

// UserUpdate struct for updating user data
#[derive(Clone, CandidType, Deserialize)]
pub struct UserUpdate {
    pub email: Option<String>,
    pub name: Option<String>,
    pub avatar_url: Option<String>,
}

// Implementation of Storable trait for User struct to enable stable storage
impl Storable for User {
    fn to_bytes(&self) -> Cow<'_, [u8]> {
        let mut _bytes = Vec::new();
        // TODO: Implement proper serialization
        Cow::Owned(_bytes)
    }

    fn into_bytes(self) -> Vec<u8> {
        let mut _bytes = Vec::new();
        // TODO: Implement proper serialization
        _bytes
    }

    fn from_bytes(_bytes: Cow<[u8]>) -> Self {
        // TODO: Implement proper deserialization
        let (id, user_principal, email, name, avatar_url) = (0, Principal::anonymous(), None, "".to_string(), None);
        User { id, user_principal, email, name, avatar_url }
    }

    const BOUND: Bound = Bound::Unbounded;
}

// Thread-local storage for managing canister state
thread_local! {
    // Memory manager for handling stable storage
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    // Stable BTree map for storing users data with Principal as key
    // Memory ID allocation:
    // 0: Users (User Canister)
    // 1-9: Reserved for User and Group Canisters 
    // 10-19: Post Canister (10: Posts, 11: Comments, 12: Post Views)
    // 20-29: Event/Tal3a Canister (20: Events, 21: Reviews, 22: Event Comments)
    static USERS: RefCell<StableBTreeMap<Principal, User, Memory>> = RefCell::new(
        StableBTreeMap::init( 
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))), // Memory ID 0 for Users
        )
    );
    
    // Counter for generating unique user IDs
    static NEXT_ID: RefCell<u64> = RefCell::new(1);
}





// Get user data for the calling principal
// Creates a new user if none exists
#[query]
fn get_user_data() -> Result<User, String> { 
    let caller: Principal = ic_cdk::caller();
    
    // Reject anonymous users for security
    if caller == Principal::anonymous() {
        return Err("Anonymous user cannot access user data".to_string());
    }
    
    // Try to find existing user
    let user = USERS.with(|users| {
        users.borrow_mut().get(&caller).map(|u| u.clone())
    });
    
    if let Some(user) = user {
        Ok(user)
    } else {
        // Create new user if none exists
        let id = NEXT_ID.with(|id| {
            let mut next_id = id.borrow_mut();
            let current_id = *next_id;
            *next_id += 1;
            current_id
        });
        
        let new_user = User {
            id: id,
            user_principal: caller,
            email: None,
            name: format!("User_{}", id),
            avatar_url: None,
        };
        
        // Store the new user
        USERS.with(|users| {
            users.borrow_mut().insert(caller, new_user.clone());
        });
        
        Ok(new_user)
    }
}


// Update user data for the calling principal
// Only updates fields that are provided (Some values)
#[update]
fn update_user_data(email: Option<String>, name: Option<String>, avatar_url: Option<String>) -> Result<User, String> {
    let caller: Principal = ic_cdk::caller();
    
    // Get existing user data
    let user = USERS.with(|users| {
        users.borrow_mut().get(&caller).map(|u| u.clone())
    });

    if let Some(mut user) = user {
        // Update only provided fields
        if let Some(email) = email {
            user.email = Some(email);
        }
        if let Some(name) = name {
            user.name = name;
        }
        if let Some(avatar_url) = avatar_url {
            user.avatar_url = Some(avatar_url);
        }
        
        // Save updated user data
        USERS.with(|users| {
            users.borrow_mut().insert(caller, user.clone());
        });
        
        Ok(user)
    } else {
        Err("User not found".to_string())
    }
}
  
ic_cdk::export_candid!();
