use crate::storage::USERS;
use crate::types::User;
use crate::types::PublicUser;
use crate::types::RegisteringUser;
use crate::types::{Sports, UserRole};
use crate::utils::{get_city_name_by_id, get_governorate_name_by_id};
use candid::Principal;


// create user account
pub  fn create_user_account(user: PublicUser) -> Result<PublicUser, String> {
    // Get the caller's principal ID
    let caller: Principal = ic_cdk::caller();

    // Check if user is logged in
    if caller == Principal::anonymous() {
        return Err("Anonymous user cannot create an account".to_string());
    }

    // Check if user account already exists
    if USERS.with(|users| users.borrow().contains_key(&caller)) {
        return Err("User account already exists".to_string());
    }


    // check if there is a missing data
    if user.username.is_empty() {
        return Err("Must provide a username".to_string());
    }

    // check  if city and government are valid
    if user.city == 0 || user.government == 0 {
        return Err("Invalid city or government".to_string());
    } else {
        let governorate_data = get_governorate_name_by_id(user.government);
        if governorate_data.is_none() {
            return Err("Invalid governorate ID".to_string());
        }
        
        let governorate_name = governorate_data.unwrap().name;
        if get_city_name_by_id(user.city, &governorate_name).is_none() {
            return Err("Invalid city ID".to_string());
        }
    }

    // check if the user has a valid sports
    if user.sports.is_empty() {
        return Err("Must provide at least one sport".to_string());
    }
    let mut sports = Vec::new();
    for sport in &user.sports {
        let sport = Sports::from_string(sport.to_string().as_str());
        if sport.is_none() {
            return Err("Invalid sport provided".to_string());
        }
        sports.push(sport.unwrap());
    }

    // Create a new user with the caller's principal ID
    let created_user = User { 
            principal_id: caller, 
            created_at: ic_cdk::api::time(),
            username: user.username , 
            government: user.government, 
            city: user.city, 
            points: 0,
            bio: user.bio, 
            avatar_url: user.avatar_url,
            sports: sports,
            role: UserRole::User,
            is_online: true,
            joined_groups: Vec::new(),
            joined_tal3a: Vec::new(),
    };
    USERS.with(|users| {
        users.borrow_mut().insert(caller, created_user.clone());
    });

    Ok(created_user.to_public())
}


// get the avilable next username id
pub fn get_next_username_id() -> u64 {
    // Get the next user ID from the USERS storage
    USERS.with(|users| {
        let users = users.borrow();
        let next_id = users.len() as u64 + 1;
        next_id
    })
}