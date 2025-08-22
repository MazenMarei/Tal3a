use crate::types::city::CityData;
use crate::types::notification::NewNotification;
use candid::Principal;
use ic_cdk::api::msg_caller;

pub fn get_user_canister_id() -> Result<Principal, String> {
    match option_env!("CANISTER_ID_USER_CANISTER") {
        Some(id) => Principal::from_text(id).map_err(|e| format!("Invalid canister ID: {}", e)),
        None => Err("User canister ID not found".into()),
    }
}

pub async fn get_city(city_id: u16, governorate_id: u8) -> Result<CityData, String> {
    let canister_id = get_user_canister_id()?;
    let call_results = ic_cdk::call::Call::unbounded_wait(canister_id, "get_city")
        .with_args(&(city_id, governorate_id))
        .await
        .expect("User canister call error")
        .candid::<Result<CityData, String>>()
        .expect("Candid decoding failed");
    match call_results {
        Ok(city_data) => Ok(city_data),
        Err(e) => Err(format!("Inter-canister call failed: {}", e)),
    }
}

pub async fn add_notification(
    user_id: Principal,
    notification: NewNotification,
) -> Result<(), String> {
    let canister_id = get_user_canister_id()?;
    ic_cdk::call::Call::unbounded_wait(canister_id, "add_notification")
        .with_args(&(user_id, notification))
        .await
        .expect("User canister call error")
        .candid::<Result<(), String>>()
        .expect("Candid decoding failed")
}

pub async fn get_current_user() -> Result<(), String> {
    let canister_id = get_user_canister_id()?;
    let user = msg_caller();

    match ic_cdk::call::Call::unbounded_wait(canister_id, "get_user")
        .with_arg(&user)
        .await
    {
        Ok(_user_data) => Ok(()),
        Err(e) => Err(format!("User canister call error: {:?}", e)),
    }
}
