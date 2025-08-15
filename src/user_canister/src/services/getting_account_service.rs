use crate::storage::USERS;
use crate::types::{User, PublicUser};

use candid::Principal;



// Get current user data
pub fn get_current_user_data() -> Result<PublicUser, String> {  
    // Get the caller's principal ID
    let caller: Principal = ic_cdk::caller();
    // Check if user is logged in
    if caller == Principal::anonymous() {
        return Err("Anonymous user cannot access user data".to_string());
    }

   // Get user data with caller
   let user = USERS.with(|users| {
        users.borrow().get(&caller).map(|u| u.clone())
    });

    if let Some(user) = user { 
        Ok(user.to_public())
    } else {
        Err("User not found".into())
    }
}



// Get public user data (excluding sensitive information)
pub fn get_public_user_data(user_principal: Principal) -> Result<PublicUser, String> {
    // Check if user is logged in
    if user_principal == Principal::anonymous() {
        return Err("Anonymous user cannot access user data".to_string());
    }

    // Check if the requested user exists
    let user = USERS.with(|users| {
        users.borrow().get(&user_principal).map(|u| u.clone())
    });

    if let Some(user) = user {
        Ok(user.to_public())
    } else {
        Err("User not found".into())
    }
}
