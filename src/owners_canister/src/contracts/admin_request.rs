use crate::services;
use crate::types::{AdminRequest, CreateAdminRequest, Error, ProcessAdminRequest};
use ic_cdk::{query, update};

// Submit admin request
#[update]
pub async fn submit_admin_request(request_data: CreateAdminRequest) -> Result<AdminRequest, Error> {
    let caller = ic_cdk::api::msg_caller();

    services::admin_request::create_admin_request(caller, request_data).await
}

// Process admin request (approve/reject)
#[update]
pub fn process_admin_request(process_data: ProcessAdminRequest) -> Result<AdminRequest, Error> {
    let caller = ic_cdk::api::msg_caller();

    services::admin_request::process_admin_request(caller, process_data)
}

// Get all admin requests (super admin only)
#[query]
pub fn get_all_admin_requests() -> Result<Vec<AdminRequest>, Error> {
    let caller = ic_cdk::api::msg_caller();

    services::admin_request::get_all_admin_requests(caller)
}

// Get pending admin requests (super admin only)
#[query]
pub fn get_pending_admin_requests() -> Result<Vec<AdminRequest>, Error> {
    let caller = ic_cdk::api::msg_caller();

    services::admin_request::get_pending_admin_requests(caller)
}

// Get user's own admin request
#[query]
pub fn get_my_admin_request() -> Result<Option<AdminRequest>, Error> {
    let caller = ic_cdk::api::msg_caller();

    services::admin_request::get_my_admin_request(caller)
}

// Delete admin request by id (super admin only)
#[update]
pub fn delete_admin_request(request_id: String) -> Result<(), Error> {
    let caller = ic_cdk::api::msg_caller();

    services::admin_request::delete_admin_request(caller, &request_id)
}
