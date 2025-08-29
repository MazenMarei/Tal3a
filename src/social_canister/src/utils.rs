use crate::types::city::CityData;
use crate::types::error::Error;
use crate::types::notification::NewNotification;
use base64::Engine;
use candid::Principal;
use ic_cdk::api::msg_caller;
use ic_cdk::management_canister::raw_rand;

pub fn get_user_canister_id() -> Result<Principal, Error> {
    match option_env!("CANISTER_ID_USER_CANISTER") {
        Some(id) => Principal::from_text(id).map_err(|e| Error {
            code: 400,
            error: format!("Invalid canister ID: {}", e),
            message: "Invalid canister ID".into(),
        }),
        None => Err(Error {
            code: 404,
            error: "User canister ID not found".into(),
            message: "User canister ID not found".into(),
        }),
    }
}

pub async fn get_city(city_id: u16, governorate_id: u8) -> Result<CityData, Error> {
    let canister_id = get_user_canister_id()?;
    let call_results = ic_cdk::call::Call::unbounded_wait(canister_id, "get_city")
        .with_args(&(city_id, governorate_id))
        .await
        .expect("User canister call error")
        .candid::<Result<CityData, String>>()
        .expect("Candid decoding failed");
    match call_results {
        Ok(city_data) => Ok(city_data),
        Err(e) => Err(Error {
            code: 500,
            error: format!("Inter-canister call failed: {}", e),
            message: "Failed to retrieve city data".into(),
        }),
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
        .map_err(|e| Error {
            code: 500,
            error: format!("User canister call error: {}", e),
            message: "Failed to add notification".into(),
        })?;

    Ok(())
}

pub async fn get_current_user() -> Result<(), Error> {
    let canister_id = get_user_canister_id()?;
    let user = msg_caller();

    match ic_cdk::call::Call::unbounded_wait(canister_id, "get_user")
        .with_arg(&user)
        .await
    {
        Ok(_user_data) => Ok(()),
        Err(e) => Err(Error {
            code: 500,
            error: format!("User canister call error: {:?}", e),
            message: "Failed to retrieve user data".into(),
        }),
    }
}

pub async fn generate_unique_id() -> Result<String, Error> {
    raw_rand()
        .await
        .map_err(|e| Error {
            code: 500,
            error: format!("Random error: {:?}", e),
            message: "Failed to generate unique ID".into(),
        })
        .map(|bytes| {
            // Use base64 encoding for shorter, URL-safe IDs
            base64::engine::general_purpose::URL_SAFE_NO_PAD.encode(&bytes)
        })
}
