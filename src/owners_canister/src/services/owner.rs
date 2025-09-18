use crate::types::{Error, Owner, OwnerRole, Permission};
use crate::{is_owner, storage};
use candid::Principal;
use std::collections::HashSet;

// Helper function to get current timestamp
fn current_timestamp() -> u64 {
    ic_cdk::api::time() / 1_000_000_000 // Convert nanoseconds to seconds
}

// Initialize the canister with the first super admin
pub fn initialize_canister() {
    let caller_principal = ic_cdk::api::msg_caller();

    // Set the deployer as the initial super admin
    storage::set_super_admin(caller_principal);

    // Create the initial super admin owner record
    let super_admin_owner = Owner {
        principal: caller_principal,
        name: "Initial Super Admin".to_string(),
        role: OwnerRole::SuperAdmin,
        created_at: current_timestamp(),
        created_by: caller_principal, // Self-created
        permissions: vec![
            Permission::ManageOwners,
            Permission::ManageGroups,
            Permission::ManageUsers,
            Permission::ModerateContent,
            Permission::ViewAnalytics,
            Permission::SystemConfiguration,
        ],
    };

    // Store the super admin
    storage::insert_owner(super_admin_owner);
}

// Check if caller is a super admin
pub fn is_super_admin(principal: &Principal) -> bool {
    storage::get_super_admin().map_or(false, |super_admin| super_admin == *principal)
        || has_permission(principal, &Permission::ManageOwners)
}

// Check if caller has specific permission
pub fn has_permission(principal: &Principal, permission: &Permission) -> bool {
    storage::get_owner(principal).map_or(false, |owner| owner.permissions.contains(permission))
}

// Add a new owner
pub fn add_owner(
    caller: &Principal,
    new_owner_principal: Principal,
    name: String,
    role: OwnerRole,
    permissions: Vec<Permission>,
) -> Result<(), Error> {
    // Check if caller is super admin
    if !is_super_admin(caller) {
        return Err(Error::NotAuthorized(
            "Only super admins can add owners".to_string(),
        ));
    }

    // Check if owner already exists
    if storage::owner_exists(&new_owner_principal) {
        return Err(Error::AlreadyExists(
            "Principal is already an owner".to_string(),
        ));
    }

    // Validate permissions based on role
    let valid_permissions = validate_role_permissions(&role, permissions)?;

    // Create new owner
    let new_owner = Owner {
        principal: new_owner_principal,
        name,
        role,
        created_at: current_timestamp(),
        created_by: *caller,
        permissions: valid_permissions,
    };

    // Store the new owner
    storage::insert_owner(new_owner);
    Ok(())
}

// Remove an owner
pub fn remove_owner(caller: &Principal, owner_principal: Principal) -> Result<(), Error> {
    // Check if caller is super admin
    if !is_super_admin(caller) {
        return Err(Error::NotAuthorized(
            "Only super admins can remove owners".to_string(),
        ));
    }

    let selected_owner = storage::get_owner(&owner_principal)
        .ok_or_else(|| Error::NotFound("Owner not found".to_string()))?;

    // cannot remove the absolute super owner
    if selected_owner.role == OwnerRole::SuperAdmin
        && selected_owner.principal == selected_owner.created_by
    {
        return Err(Error::NotAuthorized(
            "Cannot remove the absolute super admin".to_string(),
        ));
    }

    // cannot remove himself
    if owner_principal == *caller {
        return Err(Error::InvalidInput(
            "Super admins cannot remove themselves".to_string(),
        ));
    }

    // Cannot remove self if you're the only super admin
    if owner_principal == *caller && storage::count_super_admins() <= 1 {
        return Err(Error::InvalidInput(
            "Cannot remove the last super admin".to_string(),
        ));
    }

    // Remove the owner
    if storage::remove_owner(&owner_principal) {
        Ok(())
    } else {
        Err(Error::NotFound("Owner not found".to_string()))
    }
}

// Get all owners
pub fn get_all_owners(caller: &Principal) -> Result<Vec<Owner>, Error> {
    // Check if caller is an owner
    if !storage::owner_exists(caller) {
        return Err(Error::NotAuthorized(
            "Only owners can view the owners list".to_string(),
        ));
    }

    Ok(storage::get_all_owners())
}

// Get owner info
pub fn get_owner_info(caller: &Principal) -> Result<Owner, Error> {
    storage::get_owner(caller).ok_or_else(|| Error::NotFound("You are not an owner".to_string()))
}

// Update owner permissions
pub fn update_owner_permissions(
    caller: &Principal,
    owner_principal: Principal,
    new_permissions: Vec<Permission>,
) -> Result<(), Error> {
    // Check if caller is super admin
    if !is_super_admin(caller) && !is_owner(*caller) {
        return Err(Error::NotAuthorized(
            "Only super admins can update owner permissions".to_string(),
        ));
    }

    if owner_principal == *caller {
        return Err(Error::InvalidInput(
            "Super admins cannot update their own permissions".to_string(),
        ));
    }

    let mut owner = storage::get_owner(&owner_principal)
        .ok_or_else(|| Error::NotFound("Owner not found".to_string()))?;

    // Validate permissions based on role
    let valid_permissions = validate_role_permissions(&owner.role, new_permissions)?;
    owner.permissions = valid_permissions;

    storage::insert_owner(owner);
    Ok(())
}

// Validate permissions based on role
fn validate_role_permissions(
    role: &OwnerRole,
    permissions: Vec<Permission>,
) -> Result<Vec<Permission>, Error> {
    match role {
        OwnerRole::SuperAdmin => Ok(permissions), // Super admins can have any permissions
        OwnerRole::Admin => {
            // Admins cannot have ManageOwners or SystemConfiguration
            let forbidden: HashSet<Permission> =
                [Permission::ManageOwners, Permission::SystemConfiguration]
                    .iter()
                    .cloned()
                    .collect();

            for perm in &permissions {
                if forbidden.contains(perm) {
                    return Err(Error::InvalidInput(format!(
                        "Admins cannot have {:?} permission",
                        perm
                    )));
                }
            }
            Ok(permissions)
        }
        OwnerRole::Moderator => {
            // Moderators can only have ModerateContent and ViewAnalytics
            let allowed: HashSet<Permission> =
                [Permission::ModerateContent, Permission::ViewAnalytics]
                    .iter()
                    .cloned()
                    .collect();

            for perm in &permissions {
                if !allowed.contains(perm) {
                    return Err(Error::InvalidInput(format!(
                        "Moderators cannot have {:?} permission",
                        perm
                    )));
                }
            }
            Ok(permissions)
        }
    }
}
