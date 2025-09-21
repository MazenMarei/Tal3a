use crate::storage::{self};
use crate::types::{
    AdminRequest, AdminRequestStatus, CreateAdminRequest, Error, ProcessAdminRequest,
};
use candid::Principal;
use ic_cdk::api::time;

// Generate unique request ID
async fn generate_request_id() -> String {
    let timestamp = time();
    let random = ic_cdk::management_canister::raw_rand()
        .await
        .unwrap_or_else(|_| vec![0; 8]);
    format!("req_{}{}", timestamp, hex::encode(&random[..4]))
}

// Helper function to get current timestamp
fn current_timestamp() -> u64 {
    time() / 1_000_000_000 // Convert nanoseconds to seconds
}

// Create admin request
pub async fn create_admin_request(
    requester: Principal,
    request_data: CreateAdminRequest,
) -> Result<AdminRequest, Error> {
    // Check if user already made a request
    if storage::has_requested_admin_access(&requester) {
        return Err(Error {
            code: 409,
            message: "You have already submitted an admin request ".to_string(),
            error: "AlreadyExists".to_string(),
        });
    }

    // Check if user is already an owner
    if storage::owner_exists(&requester) {
        return Err(Error {
            code: 409,
            message: "You are already an owner/admin".to_string(),
            error: "AlreadyExists".to_string(),
        });
    }

    // Validate input
    if request_data.name.trim().is_empty() {
        return Err(Error {
            code: 400,
            message: "Name cannot be empty".to_string(),
            error: "InvalidInput".to_string(),
        });
    }

    if request_data.reason.trim().len() < 10 {
        return Err(Error {
            code: 400,
            message: "Reason must be at least 10 characters".to_string(),
            error: "InvalidInput".to_string(),
        });
    }

    // Create the request
    let request_id = generate_request_id().await;
    let admin_request = AdminRequest {
        id: request_id,
        requester_principal: requester,
        name: request_data.name.trim().to_string(),
        reason: request_data.reason.trim().to_string(),
        status: AdminRequestStatus::Pending,
        requested_at: current_timestamp(),
        processed_at: None,
        processed_by: None,
        rejection_reason: None,
    };

    // Store the request and mark principal as requested
    storage::insert_admin_request(admin_request.clone());
    storage::mark_principal_requested(requester);

    Ok(admin_request)
}

// Process admin request (approve/reject)
pub fn process_admin_request(
    processor: Principal,
    process_data: ProcessAdminRequest,
) -> Result<AdminRequest, Error> {
    // Check if processor is super admin
    if !crate::services::owner::is_super_admin(&processor) {
        return Err(Error {
            code: 403,
            message: "Only super admins can process admin requests".to_string(),
            error: "NotAuthorized".to_string(),
        });
    }

    // Get the request
    let mut request =
        storage::get_admin_request(&process_data.request_id).ok_or_else(|| Error {
            code: 404,
            message: "Admin request not found".to_string(),
            error: "NotFound".to_string(),
        })?;

    // Check if already processed
    if request.status != AdminRequestStatus::Pending {
        return Err(Error {
            code: 400,
            message: "Request has already been processed".to_string(),
            error: "InvalidInput".to_string(),
        });
    }

    // Update request status
    request.status = if process_data.approve {
        AdminRequestStatus::Approved
    } else {
        AdminRequestStatus::Rejected
    };

    request.processed_at = Some(current_timestamp());
    request.processed_by = Some(processor);
    request.rejection_reason = process_data.rejection_reason;

    // Update storage
    storage::update_admin_request(request.clone());

    Ok(request)
}

// Get all admin requests (for super admins)
pub fn get_all_admin_requests(caller: Principal) -> Result<Vec<AdminRequest>, Error> {
    if !crate::services::owner::is_super_admin(&caller) {
        return Err(Error {
            code: 403,
            message: "Only super admins can view all admin requests".to_string(),
            error: "NotAuthorized".to_string(),
        });
    }

    Ok(storage::get_all_admin_requests())
}

// Get pending admin requests (for super admins)
pub fn get_pending_admin_requests(caller: Principal) -> Result<Vec<AdminRequest>, Error> {
    if !crate::services::owner::is_super_admin(&caller) {
        return Err(Error {
            code: 403,
            message: "Only super admins can view pending admin requests".to_string(),
            error: "NotAuthorized".to_string(),
        });
    }

    Ok(storage::get_pending_admin_requests())
}

// Get user's own admin request
pub fn get_my_admin_request(caller: Principal) -> Result<Option<AdminRequest>, Error> {
    let all_requests = storage::get_all_admin_requests();
    let user_request = all_requests
        .into_iter()
        .find(|req| req.requester_principal == caller);

    Ok(user_request)
}

// delete admin request by id (super admin only)
pub fn delete_admin_request(caller: Principal, request_id: &str) -> Result<(), Error> {
    if !crate::services::owner::is_super_admin(&caller) {
        return Err(Error {
            code: 403,
            message: "Only super admins can delete admin requests".to_string(),
            error: "NotAuthorized".to_string(),
        });
    }
    let existing_request = storage::get_admin_request(request_id);
    if existing_request.is_none() {
        return Err(Error {
            code: 404,
            message: "Admin request not found".to_string(),
            error: "NotFound".to_string(),
        });
    }

    // Unmark the requester principal
    let requester_principal = existing_request.unwrap().requester_principal;
    storage::unmark_principal_requested(&requester_principal);

    // Remove the admin request
    if storage::remove_admin_request(request_id) {
        Ok(())
    } else {
        Err(Error {
            code: 404,
            message: "Admin request not found".to_string(),
            error: "NotFound".to_string(),
        })
    }
}
