use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

// Admin request status
#[derive(Clone, CandidType, Deserialize, Serialize, PartialEq, Debug)]
pub enum AdminRequestStatus {
    Pending,
    Approved,
    Rejected,
}

// Admin request struct
#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct AdminRequest {
    pub id: String,
    pub requester_principal: Principal,
    pub name: String,
    pub reason: String,
    pub status: AdminRequestStatus,
    pub requested_at: u64,
    pub processed_at: Option<u64>,
    pub processed_by: Option<Principal>,
    pub rejection_reason: Option<String>,
}

// Input for creating admin request
#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct CreateAdminRequest {
    pub name: String,
    pub reason: String,
}

// Input for processing admin request
#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct ProcessAdminRequest {
    pub request_id: String,
    pub approve: bool,
    pub rejection_reason: Option<String>,
}
