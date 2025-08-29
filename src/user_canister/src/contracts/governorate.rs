use crate::types::error::Error;
use crate::types::governorate::GovernorateData;
use ic_cdk;
use ic_cdk::query;
#[query]
fn get_governorate(governorate_id: u8) -> Result<GovernorateData, Error> {
    GovernorateData::get_by_id(governorate_id).map_err(|e| e)
}

#[query]
fn get_all_governorates() -> Vec<GovernorateData> {
    GovernorateData::get_all()
}
