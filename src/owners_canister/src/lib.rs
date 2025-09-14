// Owners Canister - Manages platform owners and group admins
use candid::{CandidType, Principal};
use ic_cdk::{init, query, update};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap, Storable};
use ic_stable_structures::storable::Bound;
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::borrow::Cow;
use std::collections::HashSet;

// Type alias for virtual memory
type Memory = VirtualMemory<DefaultMemoryImpl>;

// Owner struct representing a platform owner
#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct Owner {
    pub principal: Principal,        // Owner's principal ID
    pub name: String,               // Owner's name
    pub role: OwnerRole,            // Owner's role (SuperAdmin, Admin)
    pub created_at: u64,            // When the owner was added
    pub created_by: Principal,      // Who added this owner
    pub permissions: Vec<Permission>, // Specific permissions
}

// Admin struct for group admins
#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct GroupAdmin {
    pub principal: Principal,        // Admin's principal ID
    pub group_id: u64,              // Group they admin
    pub name: String,               // Admin's name
    pub permissions: Vec<GroupPermission>, // Group-specific permissions
    pub added_at: u64,              // When they were made admin
    pub added_by: Principal,        // Who made them admin
}

// Owner roles enum
#[derive(Clone, CandidType, Deserialize, Serialize, PartialEq)]
pub enum OwnerRole {
    SuperAdmin,     // Can do everything
    Admin,          // Can manage groups and users
    Moderator,      // Can moderate content
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

// Group-level permissions
#[derive(Clone, CandidType, Deserialize, Serialize, PartialEq, Eq, Hash, Debug)]
pub enum GroupPermission {
    ManageMembers,          // Add/remove group members
    ModerateContent,        // Moderate group posts
    ManageEvents,           // Manage group events
    ConfigureGroup,         // Change group settings
    ViewGroupAnalytics,     // View group statistics
}

// Implementing Storable trait for Owner
impl Storable for Owner {
    fn to_bytes(&self) -> Cow<'_, [u8]> {
        let json = serde_json::to_string(self).unwrap();
        Cow::Owned(json.into_bytes())
    }

    fn into_bytes(self) -> Vec<u8> {
        let json = serde_json::to_string(&self).unwrap();
        json.into_bytes()
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        let json = String::from_utf8(bytes.to_vec()).unwrap();
        serde_json::from_str(&json).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

// Implementing Storable trait for GroupAdmin
impl Storable for GroupAdmin {
    fn to_bytes(&self) -> Cow<'_, [u8]> {
        let json = serde_json::to_string(self).unwrap();
        Cow::Owned(json.into_bytes())
    }

    fn into_bytes(self) -> Vec<u8> {
        let json = serde_json::to_string(&self).unwrap();
        json.into_bytes()
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        let json = String::from_utf8(bytes.to_vec()).unwrap();
        serde_json::from_str(&json).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

// Thread-local storage for managing canister state
thread_local! {
    // Memory manager for handling stable storage
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    // Stable BTree map for storing platform owners
    static OWNERS: RefCell<StableBTreeMap<Principal, Owner, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(50))), // Memory ID 50 for Owners
        )
    );

    // Stable BTree map for storing group admins (key: group_id_principal)
    static GROUP_ADMINS: RefCell<StableBTreeMap<String, GroupAdmin, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(51))), // Memory ID 51 for Group Admins
        )
    );

    // Store the initial super admin principal
    static SUPER_ADMIN: RefCell<Option<Principal>> = RefCell::new(None);
}

// Helper function to get current timestamp
fn current_timestamp() -> u64 {
    ic_cdk::api::time() / 1_000_000_000 // Convert nanoseconds to seconds
}

// Initialize the canister with the first super admin
// This runs once when the canister is first deployed
#[init]
fn init() {
    let caller_principal = ic_cdk::api::caller();
    
    // Set the deployer as the initial super admin
    SUPER_ADMIN.with(|admin| {
        *admin.borrow_mut() = Some(caller_principal);
    });

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
    OWNERS.with(|owners| {
        owners.borrow_mut().insert(caller_principal, super_admin_owner);
    });
}

// Check if caller is a super admin
fn is_super_admin(principal: &Principal) -> bool {
    SUPER_ADMIN.with(|admin| {
        admin.borrow().map_or(false, |super_admin| super_admin == *principal)
    }) || is_owner_with_permission(principal, &Permission::ManageOwners)
}

// Check if caller is an owner with specific permission
fn is_owner_with_permission(principal: &Principal, permission: &Permission) -> bool {
    OWNERS.with(|owners| {
        owners.borrow().get(principal).map_or(false, |owner| {
            owner.permissions.contains(permission)
        })
    })
}

// Check if caller is a group admin with specific permission
fn is_group_admin_with_permission(principal: &Principal, group_id: u64, permission: &GroupPermission) -> bool {
    let key = format!("{}_{}", group_id, principal.to_text());
    GROUP_ADMINS.with(|admins| {
        admins.borrow().get(&key).map_or(false, |admin| {
            admin.permissions.contains(permission)
        })
    })
}

// Add a new owner (only super admins can do this)
#[update]
pub fn add_owner(
    new_owner_principal: Principal,
    name: String,
    role: OwnerRole,
    permissions: Vec<Permission>,
) -> Result<(), String> {
    let caller_principal = ic_cdk::api::caller();

    // Check if caller is super admin
    if !is_super_admin(&caller_principal) {
        return Err("Only super admins can add owners".to_string());
    }

    // Check if owner already exists
    let owner_exists = OWNERS.with(|owners| {
        owners.borrow().contains_key(&new_owner_principal)
    });

    if owner_exists {
        return Err("Principal is already an owner".to_string());
    }

    // Validate permissions based on role
    let valid_permissions = match role {
        OwnerRole::SuperAdmin => permissions, // Super admins can have any permissions
        OwnerRole::Admin => {
            // Admins cannot have ManageOwners or SystemConfiguration
            let forbidden: HashSet<Permission> = [
                Permission::ManageOwners,
                Permission::SystemConfiguration,
            ].iter().cloned().collect();
            
            for perm in &permissions {
                if forbidden.contains(perm) {
                    return Err(format!("Admins cannot have {:?} permission", perm));
                }
            }
            permissions
        },
        OwnerRole::Moderator => {
            // Moderators can only have ModerateContent and ViewAnalytics
            let allowed: HashSet<Permission> = [
                Permission::ModerateContent,
                Permission::ViewAnalytics,
            ].iter().cloned().collect();
            
            for perm in &permissions {
                if !allowed.contains(perm) {
                    return Err(format!("Moderators cannot have {:?} permission", perm));
                }
            }
            permissions
        },
    };

    // Create new owner
    let new_owner = Owner {
        principal: new_owner_principal,
        name,
        role,
        created_at: current_timestamp(),
        created_by: caller_principal,
        permissions: valid_permissions,
    };

    // Store the new owner
    OWNERS.with(|owners| {
        owners.borrow_mut().insert(new_owner_principal, new_owner);
    });

    Ok(())
}

// Remove an owner (only super admins can do this)
#[update]
pub fn remove_owner(owner_principal: Principal) -> Result<(), String> {
    let caller_principal = ic_cdk::api::caller();

    // Check if caller is super admin
    if !is_super_admin(&caller_principal) {
        return Err("Only super admins can remove owners".to_string());
    }

    // Cannot remove self if you're the only super admin
    if owner_principal == caller_principal {
        let super_admin_count = OWNERS.with(|owners| {
            owners.borrow().iter().filter(|entry| {
                let owner = entry.value();
                owner.role == OwnerRole::SuperAdmin
            }).count()
        });

        if super_admin_count <= 1 {
            return Err("Cannot remove the last super admin".to_string());
        }
    }

    // Remove the owner
    let removed = OWNERS.with(|owners| {
        owners.borrow_mut().remove(&owner_principal).is_some()
    });

    if removed {
        Ok(())
    } else {
        Err("Owner not found".to_string())
    }
}

// Add a group admin (owners or existing group admins with ManageMembers permission can do this)
#[update]
pub fn add_group_admin(
    group_id: u64,
    admin_principal: Principal,
    name: String,
    permissions: Vec<GroupPermission>,
) -> Result<(), String> {
    let caller_principal = ic_cdk::api::caller();

    // Check if caller has permission to add group admins
    let has_permission = is_owner_with_permission(&caller_principal, &Permission::ManageGroups) ||
                        is_group_admin_with_permission(&caller_principal, group_id, &GroupPermission::ManageMembers);

    if !has_permission {
        return Err("Insufficient permissions to add group admin".to_string());
    }

    // Create admin key
    let admin_key = format!("{}_{}", group_id, admin_principal.to_text());

    // Check if already admin
    let already_admin = GROUP_ADMINS.with(|admins| {
        admins.borrow().contains_key(&admin_key)
    });

    if already_admin {
        return Err("Principal is already an admin of this group".to_string());
    }

    // Create new group admin
    let new_admin = GroupAdmin {
        principal: admin_principal,
        group_id,
        name,
        permissions,
        added_at: current_timestamp(),
        added_by: caller_principal,
    };

    // Store the new admin
    GROUP_ADMINS.with(|admins| {
        admins.borrow_mut().insert(admin_key, new_admin);
    });

    Ok(())
}

// Remove a group admin
#[update]
pub fn remove_group_admin(group_id: u64, admin_principal: Principal) -> Result<(), String> {
    let caller_principal = ic_cdk::api::caller();

    // Check if caller has permission to remove group admins
    let has_permission = is_owner_with_permission(&caller_principal, &Permission::ManageGroups) ||
                        is_group_admin_with_permission(&caller_principal, group_id, &GroupPermission::ManageMembers);

    if !has_permission {
        return Err("Insufficient permissions to remove group admin".to_string());
    }

    // Create admin key
    let admin_key = format!("{}_{}", group_id, admin_principal.to_text());

    // Remove the admin
    let removed = GROUP_ADMINS.with(|admins| {
        admins.borrow_mut().remove(&admin_key).is_some()
    });

    if removed {
        Ok(())
    } else {
        Err("Group admin not found".to_string())
    }
}

// Get all owners (only owners can see this)
#[query]
pub fn get_all_owners() -> Result<Vec<Owner>, String> {
    let caller_principal = ic_cdk::api::caller();

    // Check if caller is an owner
    let is_owner = OWNERS.with(|owners| {
        owners.borrow().contains_key(&caller_principal)
    });

    if !is_owner {
        return Err("Only owners can view the owners list".to_string());
    }

    let owners = OWNERS.with(|owners| {
        owners.borrow().iter().map(|entry| entry.value()).collect()
    });

    Ok(owners)
}

// Get group admins for a specific group
#[query]
pub fn get_group_admins(group_id: u64) -> Result<Vec<GroupAdmin>, String> {
    let caller_principal = ic_cdk::api::caller();

    // Check if caller has permission to view group admins
    let has_permission = is_owner_with_permission(&caller_principal, &Permission::ManageGroups) ||
                        is_group_admin_with_permission(&caller_principal, group_id, &GroupPermission::ViewGroupAnalytics);

    if !has_permission {
        return Err("Insufficient permissions to view group admins".to_string());
    }

    let admins = GROUP_ADMINS.with(|admins| {
        admins.borrow().iter()
            .filter_map(|entry| {
                let admin = entry.value();
                if admin.group_id == group_id {
                    Some(admin)
                } else {
                    None
                }
            })
            .collect()
    });

    Ok(admins)
}

// Check if a principal is an owner
#[query]
pub fn is_owner(principal: Principal) -> bool {
    OWNERS.with(|owners| {
        owners.borrow().contains_key(&principal)
    })
}

// Check if a principal is a group admin
#[query]
pub fn is_group_admin(group_id: u64, principal: Principal) -> bool {
    let admin_key = format!("{}_{}", group_id, principal.to_text());
    GROUP_ADMINS.with(|admins| {
        admins.borrow().contains_key(&admin_key)
    })
}

// Get caller's owner info
#[query]
pub fn get_my_owner_info() -> Result<Owner, String> {
    let caller_principal = ic_cdk::api::caller();
    
    OWNERS.with(|owners| {
        owners.borrow().get(&caller_principal)
            .ok_or_else(|| "You are not an owner".to_string())
    })
}

// Get caller's group admin info for all groups
#[query]
pub fn get_my_group_admin_info() -> Vec<GroupAdmin> {
    let caller_principal = ic_cdk::api::caller();
    
    GROUP_ADMINS.with(|admins| {
        admins.borrow().iter()
            .filter_map(|entry| {
                let admin = entry.value();
                if admin.principal == caller_principal {
                    Some(admin)
                } else {
                    None
                }
            })
            .collect()
    })
}

// Update owner permissions (only super admins)
#[update]
pub fn update_owner_permissions(
    owner_principal: Principal,
    new_permissions: Vec<Permission>,
) -> Result<(), String> {
    let caller_principal = ic_cdk::api::caller();

    // Check if caller is super admin
    if !is_super_admin(&caller_principal) {
        return Err("Only super admins can update owner permissions".to_string());
    }

    OWNERS.with(|owners| {
        let mut owners_map = owners.borrow_mut();
        match owners_map.get(&owner_principal) {
            Some(mut owner) => {
                // Validate permissions based on role
                match owner.role {
                    OwnerRole::SuperAdmin => {
                        owner.permissions = new_permissions;
                    },
                    OwnerRole::Admin => {
                        let forbidden: HashSet<Permission> = [
                            Permission::ManageOwners,
                            Permission::SystemConfiguration,
                        ].iter().cloned().collect();
                        
                        for perm in &new_permissions {
                            if forbidden.contains(perm) {
                                return Err(format!("Admins cannot have {:?} permission", perm));
                            }
                        }
                        owner.permissions = new_permissions;
                    },
                    OwnerRole::Moderator => {
                        let allowed: HashSet<Permission> = [
                            Permission::ModerateContent,
                            Permission::ViewAnalytics,
                        ].iter().cloned().collect();
                        
                        for perm in &new_permissions {
                            if !allowed.contains(perm) {
                                return Err(format!("Moderators cannot have {:?} permission", perm));
                            }
                        }
                        owner.permissions = new_permissions;
                    },
                }

                owners_map.insert(owner_principal, owner);
                Ok(())
            }
            None => Err("Owner not found".to_string()),
        }
    })
}

// Update group admin permissions
#[update]
pub fn update_group_admin_permissions(
    group_id: u64,
    admin_principal: Principal,
    new_permissions: Vec<GroupPermission>,
) -> Result<(), String> {
    let caller_principal = ic_cdk::api::caller();

    // Check if caller has permission to update group admin permissions
    let has_permission = is_owner_with_permission(&caller_principal, &Permission::ManageGroups) ||
                        is_group_admin_with_permission(&caller_principal, group_id, &GroupPermission::ManageMembers);

    if !has_permission {
        return Err("Insufficient permissions to update group admin permissions".to_string());
    }

    let admin_key = format!("{}_{}", group_id, admin_principal.to_text());

    GROUP_ADMINS.with(|admins| {
        let mut admins_map = admins.borrow_mut();
        match admins_map.get(&admin_key) {
            Some(mut admin) => {
                admin.permissions = new_permissions;
                admins_map.insert(admin_key, admin);
                Ok(())
            }
            None => Err("Group admin not found".to_string()),
        }
    })
}