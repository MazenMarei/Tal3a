# Memory ID Allocation Strategy - Team Coordination

## Memory ID Distribution Plan

To avoid conflicts between different canister functionalities, we have allocated Memory IDs as follows:

### Memory ID Ranges

| Range | Canister Type          | Responsible Developer | Usage                           |
| ----- | ---------------------- | --------------------- | ------------------------------- |
| 0-9   | User & Group Canisters | Your Colleague        | User management, group data     |
| 10-19 | Post Canister          | You                   | Posts, comments, interactions   |
| 20-29 | Event (Tal3a) Canister | You                   | Events, reviews, event comments |
| 30-39 | Reserved               | Future expansion      | Additional features             |

### Current Memory ID Usage

#### User Canister (lib.rs) - Your Colleague's Work

- **ID 0**: Users storage (`StableBTreeMap<Principal, User>`)
- **ID 1-9**: Reserved for Group Canister and additional User features

#### Post Canister (post_canister.rs) - Your Work

- **ID 10**: Posts storage (`StableBTreeMap<u64, Post>`)
- **ID 11**: Comments storage (`StableBTreeMap<u64, Comment>`)
- **ID 12**: Post Views storage (`StableBTreeMap<String, PostView>`)
- **ID 13-19**: Reserved for future Post features

#### Event/Tal3a Canister (event_canister.rs) - Your Work

- **ID 20**: Events/Tal3as storage (`StableBTreeMap<u64, Tal3a>`)
- **ID 21**: Reviews storage (`StableBTreeMap<u64, Review>`)
- **ID 22**: Event Comments storage (`StableBTreeMap<u64, EventComment>`)
- **ID 23-29**: Reserved for future Event features

## Integration Points

### Shared Data Structures

Your colleague will need access to these types for Group Canister:

```rust
// User struct (defined in lib.rs)
pub struct User {
    pub id: u64,
    pub user_principal: Principal,
    pub email: Option<String>,
    pub name: String,
    pub avatar_url: Option<String>,
}
```

### Inter-Canister Communication

#### Functions Your Canisters Need from User/Group Canisters:

1. **User ID Resolution**: Convert `Principal` to `u64` user ID
2. **Group Validation**: Check if group exists and user has permissions
3. **User Existence Check**: Verify user exists before creating posts/events

#### Functions User/Group Canisters Might Need:

1. **Get User Posts**: Retrieve posts by a specific user
2. **Get User Events**: Retrieve events organized by a user
3. **Get Group Activity**: Get posts and events for a group

### Recommended Coordination

#### Step 1: Define Shared Types

- Keep `User` struct in `lib.rs` (already done)
- Your colleague should define `Group` struct in separate module
- Both reference these types

#### Step 2: Helper Functions

Create these functions in `lib.rs` for shared use:

```rust
// Get user ID from principal (for your canisters to use)
pub fn get_user_id_from_principal(principal: Principal) -> Option<u64>

// Check if user exists (for validation)
pub fn user_exists(user_id: u64) -> bool

// Get user by ID (for display purposes)
pub fn get_user_by_id(user_id: u64) -> Option<User>
```

#### Step 3: Group Integration

Your colleague should create similar functions for groups:

```rust
// Check if group exists
pub fn group_exists(group_id: u64) -> bool

// Check if user is member of group
pub fn is_group_member(group_id: u64, user_id: u64) -> bool

// Get group details
pub fn get_group_by_id(group_id: u64) -> Option<Group>
```

## File Organization

### Current Structure

```
src/tal3a_backend/src/
├── lib.rs              # User Canister + shared types (Your colleague)
├── post_canister.rs    # Your work - Posts and comments
├── event_canister.rs   # Your work - Events and activities
└── group_canister.rs   # Your colleague's work (to be created)
```

### Recommended Modules

Your colleague should add to `lib.rs`:

```rust
// Add this to module declarations
pub mod group_canister;

// Re-export Group types
pub use group_canister::{Group, GroupUpdate, GroupMember};
```

## Testing Strategy

### Individual Testing

- Test your canisters with mock user/group data
- Use placeholder functions for inter-canister calls

### Integration Testing

- Create test users and groups first
- Test post creation with valid group IDs
- Test event creation with valid organizers
- Verify permissions and validations work

## Deployment Considerations

### Development Phase

- Each developer can test their canister independently
- Use mock/placeholder functions for missing dependencies

### Integration Phase

- Implement actual inter-canister calls
- Test full user journey (create user → join group → create posts/events)
- Verify data consistency across canisters

### Production Deployment

- Deploy User Canister first
- Deploy Group Canister second
- Deploy Post and Event Canisters last
- Run integration tests after deployment

## Git Workflow

### Branch Strategy

- `feature/user-group-canisters` (Your colleague)
- `feature/post-event-canisters` (You - current)
- `feature/integration` (Both - for combining work)

### Merge Strategy

1. Both complete individual features
2. Create integration branch
3. Resolve any conflicts in `lib.rs`
4. Test integrated functionality
5. Merge to main branch

## Communication Checklist

### Before Starting Integration

- [ ] Confirm Memory ID allocations
- [ ] Define shared function signatures
- [ ] Agree on data structure formats
- [ ] Plan inter-canister call interfaces

### During Development

- [ ] Share progress on shared types
- [ ] Coordinate changes to `lib.rs`
- [ ] Test with mock data from other canisters
- [ ] Document new functions and endpoints

### Before Final Integration

- [ ] Code review each other's work
- [ ] Test individual canisters thoroughly
- [ ] Plan integration testing approach
- [ ] Prepare integration branch

This allocation ensures no memory conflicts and provides clear boundaries for each developer's work.
