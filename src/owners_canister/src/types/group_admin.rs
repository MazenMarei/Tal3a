use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

// Group-level permissions
#[derive(Clone, CandidType, Deserialize, Serialize, PartialEq, Eq, Hash, Debug)]
pub enum GroupPermission {
    ManageMembers,          // Add/remove group members
    ModerateContent,        // Moderate group posts
    ManageEvents,           // Manage group events
    ConfigureGroup,         // Change group settings
    ViewGroupAnalytics,     // View group statistics
}

// Admin struct for group admins
#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct GroupAdmin {
    pub principal: Principal,              // Admin's principal ID
    pub group_id: u64,                    // Group they admin
    pub name: String,                     // Admin's name
    pub permissions: Vec<GroupPermission>, // Group-specific permissions
    pub added_at: u64,                    // When they were made admin
    pub added_by: Principal,              // Who made them admin
}