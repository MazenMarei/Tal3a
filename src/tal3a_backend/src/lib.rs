use candid::Principal;
use ic_cdk::query;
use ic_cdk;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory };
use ic_stable_structures::Storable;
use ic_stable_structures::storable::Bound;



type Memory = VirtualMemory<DefaultMemoryImpl>;
use serde::Deserialize;
use candid::CandidType;

#[derive(Clone, CandidType, Deserialize)]
pub struct User {
    pub id: u64,
    pub user_principal: Principal,
    pub email: Option<String>,
    pub name: String,
    pub avatar_url: Option<String>,
}

impl Storable for User {
    fn to_bytes(&self) -> Cow<'_, [u8]> {
        let mut _bytes = Vec::new();
        Cow::Owned(_bytes)
    }

    fn into_bytes(self) -> Vec<u8> {
        let mut _bytes = Vec::new();
        _bytes
    }

    fn from_bytes(_bytes: Cow<[u8]>) -> Self {
        let (id, user_principal, email, name, avatar_url) = (0, Principal::anonymous(), None, "".to_string(), None);
        User { id, user_principal, email, name, avatar_url }
    }


    const BOUND: Bound = Bound::Unbounded;
}

thread_local! {
 
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    // Initialize a `StableBTreeMap` with `MemoryId(0)`.
    static USERS: RefCell<StableBTreeMap<Principal, User, Memory>> = RefCell::new(
        StableBTreeMap::init( 
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),
        )
    );
    static NEXT_ID: RefCell<u64> = RefCell::new(1);
}





#[query]
fn get_user_data() -> Result<User, String> { 
    let caller: Principal = ic_cdk::caller();
    if caller == Principal::anonymous() {
        return Err("Anonymous user cannot access user data".to_string());
    }
    let user = USERS.with(|users| {
        users.borrow_mut().get(&caller).map(|u| u.clone())
    });
    if let Some(user) = user {
        Ok(user)
    } else {
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
        USERS.with(|users| {
            users.borrow_mut().insert(caller, new_user.clone());
        });
        Ok(new_user)
    }
}


#[query]
fn update_user_data(email: Option<String>, name: Option<String>, avatar_url: Option<String>) -> Result<User, String> {
    let caller: Principal = ic_cdk::caller();
    let user = USERS.with(|users| {
        users.borrow_mut().get(&caller).map(|u| u.clone())
    });

    if let Some(mut user) = user {
        if let Some(email) = email {
            user.email = Some(email);
        }
        if let Some(name) = name {
            user.name = name;
        }
        if let Some(avatar_url) = avatar_url {
            user.avatar_url = Some(avatar_url);
        }
        USERS.with(|users| {
            users.borrow_mut().insert(caller, user.clone());
        });
        Ok(user)
    } else {
        Err("User not found".to_string())
    }
}
  
ic_cdk::export_candid!();
