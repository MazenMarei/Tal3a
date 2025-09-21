use crate::services::owner;
use crate::storage;
use crate::types::{Error, GroupAdmin, GroupPermission};
use candid::Principal;

// Helper function to get current timestamp
fn current_timestamp() -> u64 {
    ic_cdk::api::time() / 1_000_000_000 // Convert nanoseconds to seconds
}

// Check if caller is a group admin with specific permission
pub fn has_group_permission(
    principal: &Principal,
    group_id: u64,
    permission: &GroupPermission,
) -> bool {
    storage::get_group_admin(group_id, principal)
        .map_or(false, |admin| admin.permissions.contains(permission))
}

// Add a group admin
pub fn add_group_admin(
    caller: &Principal,
    group_id: u64,
    admin_principal: Principal,
    name: String,
    permissions: Vec<GroupPermission>,
) -> Result<(), Error> {
    // Check if caller has permission to add group admins
    let has_permission = owner::has_permission(caller, &crate::types::Permission::ManageGroups)
        || has_group_permission(caller, group_id, &GroupPermission::ManageMembers);

    if !has_permission {
        return Err(Error {
            code: 403,
            message: "Insufficient permissions to add group admin".to_string(),
            error: "NotAuthorized".to_string(),
        });
    }

    // Check if already admin
    if storage::group_admin_exists(group_id, &admin_principal) {
        return Err(Error {
            code: 409,
            message: "Principal is already an admin of this group".to_string(),
            error: "AlreadyExists".to_string(),
        });
    }

    // Create new group admin
    let new_admin = GroupAdmin {
        principal: admin_principal,
        group_id,
        name,
        permissions,
        added_at: current_timestamp(),
        added_by: *caller,
    };

    // Store the new admin
    storage::insert_group_admin(new_admin);
    Ok(())
}

// Remove a group admin
pub fn remove_group_admin(
    caller: &Principal,
    group_id: u64,
    admin_principal: Principal,
) -> Result<(), Error> {
    // Check if caller has permission to remove group admins
    let has_permission = owner::has_permission(caller, &crate::types::Permission::ManageGroups)
        || has_group_permission(caller, group_id, &GroupPermission::ManageMembers);

    if !has_permission {
        return Err(Error {
            code: 403,
            message: "Insufficient permissions to remove group admin".to_string(),
            error: "NotAuthorized".to_string(),
        });
    }

    // Remove the admin
    if storage::remove_group_admin(group_id, &admin_principal) {
        Ok(())
    } else {
        Err(Error {
            code: 500,
            message: "Failed to remove group admin".to_string(),
            error: "InternalError".to_string(),
        })
    }
}

// Get group admins for a specific group
pub fn get_group_admins(caller: &Principal, group_id: u64) -> Result<Vec<GroupAdmin>, Error> {
    // Check if caller has permission to view group admins
    let has_permission = owner::has_permission(caller, &crate::types::Permission::ManageGroups)
        || has_group_permission(caller, group_id, &GroupPermission::ViewGroupAnalytics);

    if !has_permission {
        return Err(Error {
            code: 403,
            message: "Insufficient permissions to view group admins".to_string(),
            error: "NotAuthorized".to_string(),
        });
    }

    Ok(storage::get_group_admins_for_group(group_id))
}

// Get caller's group admin info for all groups
pub fn get_user_group_admin_info(caller: &Principal) -> Vec<GroupAdmin> {
    storage::get_user_group_admins(caller)
}

// Update group admin permissions
pub fn update_group_admin_permissions(
    caller: &Principal,
    group_id: u64,
    admin_principal: Principal,
    new_permissions: Vec<GroupPermission>,
) -> Result<(), Error> {
    // Check if caller has permission to update group admin permissions
    let has_permission = owner::has_permission(caller, &crate::types::Permission::ManageGroups)
        || has_group_permission(caller, group_id, &GroupPermission::ManageMembers);

    if !has_permission {
        return Err(Error {
            code: 403,
            message: "Insufficient permissions to update group admin permissions".to_string(),
            error: "NotAuthorized".to_string(),
        });
    }

    let mut admin = storage::get_group_admin(group_id, &admin_principal).ok_or_else(|| Error {
        code: 404,
        message: "Group admin not found".to_string(),
        error: "NotFound".to_string(),
    })?;

    admin.permissions = new_permissions;
    storage::insert_group_admin(admin);
    Ok(())
}

// Check if a principal is a group admin
pub fn is_group_admin(group_id: u64, principal: &Principal) -> bool {
    storage::group_admin_exists(group_id, principal)
}
