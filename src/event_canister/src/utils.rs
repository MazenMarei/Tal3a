use crate::types::error::Error;
use candid::Principal;
use ic_cdk::management_canister::raw_rand;

use crate::types::{city::CityData, notification::NewNotification};

pub async fn generate_unique_id() -> u64 {
    match raw_rand().await {
        Ok(bytes) => {
            // Convert first 8 bytes to u64 for unique ID
            let mut id_bytes = [0u8; 8];
            id_bytes.copy_from_slice(&bytes[..8]);
            u64::from_be_bytes(id_bytes)
        }
        Err(_) => {
            // Fallback to timestamp if random fails
            ic_cdk::api::time()
        }
    }
}

pub fn get_user_canister_id() -> Result<Principal, Error> {
    match option_env!("CANISTER_ID_USER_CANISTER") {
        Some(id) => Principal::from_text(id).map_err(|e| Error {
            code: 400,
            error: format!("Invalid canister ID: {}", e),
            message: "Failed to parse user canister ID".into(),
        }),
        None => Err(Error {
            code: 404,
            error: "User canister ID not found".into(),
            message: "User canister ID is not set in the environment".into(),
        }),
    }
}

pub async fn get_city(city_id: u16, governorate_id: u8) -> Result<CityData, Error> {
    let canister_id = get_user_canister_id()?;
    let call_results = ic_cdk::call::Call::unbounded_wait(canister_id, "get_city")
        .with_args(&(city_id, governorate_id))
        .await
        .expect("User canister call error")
        .candid::<Result<CityData, Error>>()
        .expect("Candid decoding failed");
    match call_results {
        Ok(city_data) => Ok(city_data),
        Err(e) => Err(e),
    }
}

pub async fn add_notification(
    user_id: Principal,
    notification: NewNotification,
) -> Result<(), Error> {
    let canister_id = get_user_canister_id()?;
    ic_cdk::call::Call::unbounded_wait(canister_id, "add_notification")
        .with_args(&(user_id, notification))
        .await
        .expect("User canister call error")
        .candid::<Result<(), Error>>()
        .expect("Candid decoding failed")
}
