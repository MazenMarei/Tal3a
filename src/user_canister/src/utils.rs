use serde_json::{self, Value};
use crate::types::{CityData, GovernorateData};
// Egyptian cities JSON
const CITIES_JSON: &str = include_str!("egypt_cities_grouped_by_governorates.json");
const GOVERNORATES_JSON: &str = include_str!("egypt_governorates.json");



pub fn get_city_by_id(city_id: u16, governorate_id: u8) -> Option<CityData> {
    let cities_data: Value = serde_json::from_str(CITIES_JSON).ok()?;
    
    // Navigate to the governorate
    let governorate_name = get_governorate_by_id(governorate_id);
    
    if governorate_name.is_none() {
        return None;
    }

    let governorate_cities = cities_data.get(&&governorate_name.unwrap().name.to_string())?;

    // Get the city by ID
    let city_value = governorate_cities.get(&city_id.to_string())?;
    
    // Check if city_value is found and valid
    if city_value.is_null() {
        return None;
    }
    
    let city_data: CityData = serde_json::from_value(city_value.clone()).ok()?;
    Some(city_data)
}

pub fn get_governorate_by_id(governorate_id: u8) -> Option<GovernorateData> {
    let governorates_data: Value = serde_json::from_str(GOVERNORATES_JSON).ok()?;
    
    // Search for the governorate ID
    let governorate_value = governorates_data.get(&governorate_id.to_string())?;

    // Check if governorate_value is found and valid
    if governorate_value.is_null() {
        return None;
    }

    let governorate_data: GovernorateData = serde_json::from_value(governorate_value.clone()).ok()?;
    Some(governorate_data)
}

pub fn get_all_governorates() -> Vec<GovernorateData> {
    let governorates_data: Value = serde_json::from_str(GOVERNORATES_JSON).unwrap_or_default();
    let mut result = Vec::new();
    
    if let Some(obj) = governorates_data.as_object() {
        for (_, gov_value) in obj {
            if let Ok(gov_data) = serde_json::from_value::<GovernorateData>(gov_value.clone()) {
                result.push(gov_data);
            }
        }
    }
    
    result
}

pub fn get_all_cities_in_governorate(governorate_id: u8) -> Vec<CityData> {
    let governorate_name = get_governorate_by_id(governorate_id);
    if governorate_name.is_none() {
        return Vec::new();
    }

    let cities_data: Value = serde_json::from_str(CITIES_JSON).unwrap_or_default();
    let mut result = Vec::new();

    if let Some(governorate_cities) = cities_data.get(&&governorate_name.unwrap().name.to_string()) {
        if let Some(obj) = governorate_cities.as_object() {
            for (_, city_value) in obj {
                if let Ok(city_data) = serde_json::from_value::<CityData>(city_value.clone()) {
                    result.push(city_data);
                }
            }
        }
    }

    result
}
