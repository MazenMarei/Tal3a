use crate::types::city::CityData;
use crate::types::error::Error;
use crate::types::governorate::GovernorateData;
use serde_json::{self, Value};

const CITIES_JSON: &str = include_str!("egypt_cities_grouped_by_governorates.json");

impl CityData {
    // * read Egyption cities JSON
    pub fn get_by_id(city_id: u16, governorate_id: u8) -> Result<CityData, Error> {
        let cities_data: Value = serde_json::from_str(CITIES_JSON).map_err(|_| Error {
            code: 500,
            error: "Failed to parse cities JSON".to_string(),
            message: "Internal Server Error".to_string(),
        })?;

        // * Navigate to the governorate
        let governorate_name = GovernorateData::get_by_id(governorate_id).map_err(|_| Error {
            code: 500,
            error: "Failed to get governorate".to_string(),
            message: "Internal Server Error".to_string(),
        })?;

        let governorate_cities =
            cities_data
                .get(&&governorate_name.name.to_string())
                .ok_or(Error {
                    code: 404,
                    error: "Governorate not found".to_string(),
                    message: "No governorate exists with the given ID".to_string(),
                })?;

        // * Get the city by ID
        let city_value = governorate_cities.get(&city_id.to_string()).ok_or(Error {
            code: 404,
            error: "City not found".to_string(),
            message: "No city exists with the given ID".to_string(),
        })?;

        // * Check if city_value is found and valid
        if city_value.is_null() {
            return Err(Error {
                code: 404,
                error: "City not found".to_string(),
                message: "No city exists with the given ID".to_string(),
            });
        }

        let city_data: CityData =
            serde_json::from_value(city_value.clone()).map_err(|_| Error {
                code: 500,
                error: "Failed to parse city data".to_string(),
                message: "Internal Server Error".to_string(),
            })?;
        Ok(city_data)
    }

    pub fn get_all_in_governorate(governorate_id: u8) -> Vec<CityData> {
        // * Get the governorate name by ID
        let governorate_name = GovernorateData::get_by_id(governorate_id);
        if governorate_name.is_err() {
            return Vec::new();
        }

        // * Read cities data
        let cities_data: Value = serde_json::from_str(CITIES_JSON).unwrap_or_default();
        let mut result = Vec::new();

        // * Get the cities for the governorate
        if let Some(governorate_cities) =
            cities_data.get(&&governorate_name.unwrap().name.to_string())
        {
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
}
