use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

// Owner roles enum
#[derive(Clone, CandidType, Deserialize, Serialize, PartialEq)]
pub enum OwnerRole {
    SuperAdmin,     // Can do everything
    Admin,          // Can manage groups and users
    Moderator,      // Can moderate content
}

// Owner struct representing a platform owner
#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct Owner {
    pub principal: Principal,         // Owner's principal ID
    pub name: String,                // Owner's name
    pub role: OwnerRole,             // Owner's role (SuperAdmin, Admin)
    pub created_at: u64,             // When the owner was added
    pub created_by: Principal,       // Who added this owner
    pub permissions: Vec<Permission>, // Specific permissions
}

// Platform-level permissions
#[derive(Clone, CandidType, Deserialize, Serialize, PartialEq, Eq, Hash, Debug)]
pub enum Permission {
    ManageOwners,           // Add/remove owners
    ManageGroups,           // Create/delete groups
    ManageUsers,            // Manage user accounts
    ModerateContent,        // Moderate posts/events
    ViewAnalytics,          // View platform analytics
    SystemConfiguration,    // Configure system settings
}