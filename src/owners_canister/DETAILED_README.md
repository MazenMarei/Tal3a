# Owners Canister - Comprehensive Documentation

## Overview

The Owners Canister is a foundational administrative canister for the Tal3a platform that provides:
- **Platform Owner Management**: Manage platform administrators with different roles and permissions
- **Group Admin Management**: Delegate administrative capabilities for specific groups
- **Permission-based Access Control**: Fine-grained authorization system
- **Secure Initialization**: Automatic setup with deployer as initial super admin

## Architecture

### Core Components

1. **Types** (`src/types/`):
   - `Owner`: Platform administrator with role and permissions
   - `GroupAdmin`: Group-level administrator for specific groups
   - `OwnerRole`: SuperAdmin, Admin, Moderator
   - `Permission`: Platform-level permissions
   - `GroupPermission`: Group-level permissions

2. **Storage** (`src/storage.rs`):
   - Stable BTreeMap storage for persistence across upgrades
   - Memory IDs: 50 (Owners), 51 (Group Admins)
   - Thread-local storage management

3. **Services** (`src/services/`):
   - Business logic and validation
   - Permission checking and role management
   - State management functions

4. **Contracts** (`src/contracts/`):
   - Public API endpoints
   - Input validation and error handling
   - Candid interface implementation

## Initialization

The canister uses the `#[init]` attribute to automatically initialize when first deployed:

```rust
#[ic_cdk::init]
fn init() {
    services::owner::initialize_canister();
}
```

**Key Points for Production Deployment:**
- The deploying principal becomes the initial Super Admin
- This happens automatically on first deployment
- No hardcoded principals - dynamic based on deployment context
- Initial super admin gets all permissions by default

## Roles and Permissions

### Owner Roles

1. **SuperAdmin**
   - Can add/remove all owners
   - Can manage system configuration
   - Has all permissions

2. **Admin**
   - Can manage groups and users
   - Cannot manage owners or system config
   - Limited permission set

3. **Moderator**
   - Can moderate content only
   - View analytics
   - Most restricted role

### Platform Permissions

- `ManageOwners`: Add/remove platform owners
- `ManageGroups`: Create/delete groups
- `ManageUsers`: Manage user accounts
- `ModerateContent`: Moderate posts/events
- `ViewAnalytics`: View platform analytics
- `SystemConfiguration`: Configure system settings

### Group Permissions

- `ManageMembers`: Add/remove group members
- `ModerateContent`: Moderate group content
- `ManageEvents`: Create/manage group events
- `ConfigureGroup`: Change group settings
- `ViewGroupAnalytics`: View group statistics

## API Endpoints

### Owner Management

```candid
// Add a new platform owner (SuperAdmin only)
add_owner : (principal, text, OwnerRole, vec Permission) -> (variant { Ok; Err : text });

// Remove an owner (SuperAdmin only)
remove_owner : (principal) -> (variant { Ok; Err : text });

// Get all owners (Owners only)
get_all_owners : () -> (variant { Ok : vec Owner; Err : text }) query;

// Get caller's owner info
get_my_owner_info : () -> (variant { Ok : Owner; Err : text }) query;

// Update owner permissions (SuperAdmin only)
update_owner_permissions : (principal, vec Permission) -> (variant { Ok; Err : text });
```

### Group Admin Management

```candid
// Add group admin (Owners with ManageGroups permission)
add_group_admin : (nat64, principal, text, vec GroupPermission) -> (variant { Ok; Err : text });

// Remove group admin
remove_group_admin : (nat64, principal) -> (variant { Ok; Err : text });

// Get all admins for a group
get_group_admins : (nat64) -> (variant { Ok : vec GroupAdmin; Err : text }) query;

// Get caller's group admin roles
get_my_group_admin_info : () -> (vec GroupAdmin) query;

// Update group admin permissions
update_group_admin_permissions : (nat64, principal, vec GroupPermission) -> (variant { Ok; Err : text });
```

### Utility Functions

```candid
// Check if principal is platform owner
is_owner : (principal) -> (bool) query;

// Check if principal is group admin
is_group_admin : (nat64, principal) -> (bool) query;

// Get initialization status (for debugging)
get_initialization_info : () -> (variant { Ok : record { principal; nat64 }; Err : text }) query;

// Get caller's principal (for testing)
whoami : () -> (principal) query;
```

## Memory Management

The canister uses stable structures to persist data across upgrades:

- **Memory ID 50**: Platform owners storage
- **Memory ID 51**: Group admins storage
- **Thread-local state**: Super admin principal reference

## Security Features

1. **Role-based Access Control**: Different permissions for different roles
2. **Caller Verification**: All functions verify caller's authorization
3. **Last Admin Protection**: Cannot remove the last super admin
4. **Permission Validation**: Roles have restricted permission sets
5. **Audit Trail**: Tracks who created/modified each record

## Production Deployment Notes

### Principal Handling
- **No hardcoded principals**: All principals are determined at runtime
- **Dynamic initialization**: Deployer becomes super admin automatically
- **Environment agnostic**: Works in local, testnet, and mainnet environments

### Deployment Steps
1. Deploy the canister using dfx or similar tool
2. The deploying principal automatically becomes the first super admin
3. Add additional owners as needed using `add_owner`
4. Configure group admins for specific groups

### Integration with Other Canisters
This canister is designed to be called by:
- User Canister: For user management authorization
- Group Canister: For group administration checks
- Post Canister: For content moderation
- Event Canister: For event management authorization

## Example Usage

### Adding a New Platform Admin
```javascript
// Call from super admin account
await owners_canister.add_owner(
  Principal.fromText("user-principal-here"),
  "John Doe",
  { Admin: null },
  [
    { ManageGroups: null },
    { ManageUsers: null },
    { ModerateContent: null }
  ]
);
```

### Adding a Group Admin
```javascript
// Call from owner with ManageGroups permission
await owners_canister.add_group_admin(
  123n, // group_id
  Principal.fromText("admin-principal-here"),
  "Group Admin Name",
  [
    { ManageMembers: null },
    { ModerateContent: null }
  ]
);
```

### Checking Permissions
```javascript
// Check if someone is a platform owner
const isOwner = await owners_canister.is_owner(
  Principal.fromText("check-principal-here")
);

// Check if someone is a group admin
const isGroupAdmin = await owners_canister.is_group_admin(
  123n, // group_id
  Principal.fromText("check-principal-here")
);
```

## Error Handling

All functions return `Result<T, String>` types with descriptive error messages:
- `NotAuthorized`: Caller lacks required permissions
- `NotFound`: Requested resource doesn't exist
- `AlreadyExists`: Resource already exists
- `InvalidInput`: Invalid parameters provided

## Testing

Use the utility functions for testing:

```javascript
// Get your own principal
const myPrincipal = await owners_canister.whoami();

// Check initialization status
const initInfo = await owners_canister.get_initialization_info();
console.log(`Super Admin: ${initInfo.Ok[0]}, Owners Count: ${initInfo.Ok[1]}`);
```

## Build Instructions

```bash
# Install wasm target if not already installed
rustup target add wasm32-unknown-unknown

# Check code
cargo check

# Build the canister
cargo build --target wasm32-unknown-unknown --release --package owners_canister

# The wasm file will be at:
# target/wasm32-unknown-unknown/release/owners_canister.wasm
```

## File Structure

```
owners_canister/
├── Cargo.toml                 # Package configuration
├── README.md                  # Basic documentation
├── DETAILED_README.md         # This comprehensive guide
├── owners_canister.did        # Candid interface
└── src/
    ├── lib.rs                 # Main module and exports
    ├── storage.rs             # Stable storage implementation
    ├── types/
    │   ├── mod.rs            # Type module exports
    │   ├── owner.rs          # Owner and role types
    │   ├── group_admin.rs    # Group admin types
    │   └── error.rs          # Error types
    ├── services/
    │   ├── mod.rs            # Service module exports
    │   ├── owner.rs          # Owner business logic
    │   └── group_admin.rs    # Group admin business logic
    └── contracts/
        ├── mod.rs            # Contract module exports
        ├── owners.rs         # Owner API endpoints
        └── group_admins.rs   # Group admin API endpoints
```