use crate::types::city::CityData;
use crate::types::notification::NewNotification;
use candid::Principal;

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

// making inter canisters calles
// let canister_id_str = utils::get_user_canister_id();

// if canister_id_str.is_empty() {
//     return Err("User canister ID not found".to_string());
// }

// let canister_id =
//     Principal::from_text(canister_id_str).map_err(|e| format!("Invalid canister ID: {}", e))?;

// // Make the inter-canister call
// let call_results = ic_cdk::call::Call::unbounded_wait(canister_id, "get_city")
//     .with_args(&(city_id, governorate_id))
//     .await
//     .expect("User canister call error")
//     .candid::<Result<CityData, String>>()
//     .expect("Candid decoding failed");
// match call_results {
//     Ok(city_data) => Ok(city_data.name),
//     Err(e) => Err(format!("Inter-canister call failed: {}", e)),
// }
