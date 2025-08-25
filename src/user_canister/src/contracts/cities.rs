use ic_cdk;
use ic_cdk::{query};
use crate::types::city::CityData;

#[query]
fn get_city(city_id: u16, governorate_id: u8) -> Result<CityData, String> {
    CityData::get_by_id(city_id, governorate_id).map_err(|e| e.to_string())
}

#[query]
fn get_all_cities_in_governorate(governorate_id: u8) -> Vec<CityData> {
    CityData::get_all_in_governorate(governorate_id)
}