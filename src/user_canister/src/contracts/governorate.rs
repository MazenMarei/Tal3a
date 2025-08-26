use ic_cdk;
use ic_cdk::{query};
use crate::types::governorate::GovernorateData;

#[query]
fn get_governorate(governorate_id: u8) -> Result<GovernorateData, String> {
    GovernorateData::get_by_id(governorate_id).map_err(|e| e.to_string())
}

#[query]
fn get_all_governorates() -> Vec<GovernorateData> {
    GovernorateData::get_all()
}