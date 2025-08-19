use crate::types::governorate;
use serde_json::{self, Value};

use governorate::GovernorateData;

// * importing Egyptian Governorates JSON
const GOVERNORATES_JSON: &str = include_str!("egypt_governorates.json");

impl GovernorateData {
    pub fn get_by_id(governorate_id: u8) -> Result<GovernorateData , String> {
        let governorates_data: Value = serde_json::from_str(GOVERNORATES_JSON).map_err(|_| "Failed to parse governorates JSON".to_string())?;

        // * Search for the governorate ID
        let governorate_value = governorates_data.get(&governorate_id.to_string()).ok_or("Governorate not found".to_string())?;

        // * Check if governorate_value is found and valid
        if governorate_value.is_null() {
            return Err("Governorate not found".to_string());
        }

        let governorate_data: GovernorateData =
            serde_json::from_value(governorate_value.clone()).map_err(|_| "Failed to parse governorate data".to_string())?;
        Ok(governorate_data)
    }

    pub fn get_all() -> Vec<GovernorateData> {
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
}
