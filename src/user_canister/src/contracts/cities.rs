use crate::types::city::CityData;
use crate::types::error::Error;
use ic_cdk;
use ic_cdk::query;

#[query]
pub fn get_city(city_id: u16, governorate_id: u8) -> Result<CityData, Error> {
    CityData::get_by_id(city_id, governorate_id).map_err(|e| e)
}

#[query]
pub fn get_all_cities_in_governorate(governorate_id: u8) -> Vec<CityData> {
    CityData::get_all_in_governorate(governorate_id)
}
