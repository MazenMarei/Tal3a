mod types;
mod storage;
mod utils;
use candid::Principal;
use ic_cdk;
use ic_cdk::{query , update};

mod services;


use crate::services::create_account_service;
use crate::services::getting_account_service;
use crate::types::{PublicUser, RegisteringUser , CityData , GovernorateData};

#[query]
fn get_current_user_data() -> Result<PublicUser, String> {
    getting_account_service::get_current_user_data()
}


#[query]
fn get_public_user_data(user_principal: Principal) -> Result<PublicUser, String> {
    getting_account_service::get_public_user_data(user_principal)
}


#[query]
fn get_next_username_id()  -> u64 {
    create_account_service::get_next_username_id()
}

#[update]   
fn create_user_account(user: RegisteringUser) -> Result<PublicUser, String> {
    create_account_service::create_user_account(user)
}

#[update]   
// getting all governorates
fn get_all_governorates() -> Vec<GovernorateData> {
    utils::get_all_governorates()
}
#[update]   
// getting all cities in a governorate
fn get_all_cities_in_governorate(governorate_id: u8) -> Vec<CityData> {
    let cities = utils::get_all_cities_in_governorate(governorate_id);
    cities
}

#[update]   
fn get_city_by_id(city_id: u16 , governorate_id: u8) -> Option<CityData> {
    utils::get_city_by_id(city_id, governorate_id)
}

ic_cdk::export_candid!();

