# Tal3a Platform - Canister Endpoints Documentation

## Overview

The Tal3a platform is a decentralized sports community platform built on the Internet Computer. It consists of multiple canisters that handle different aspects of the platform.

## User Canister (Implemented)

Manages user profiles and authentication.

### Endpoints

#### `get_user_data() -> Result<User, String>`

- **Type**: Query
- **Description**: Retrieves user data for the calling principal. Creates a new user if none exists.
- **Authentication**: Requires authenticated caller (non-anonymous)
- **Returns**: User object or error message
- **Security**: Rejects anonymous users

#### `update_user_data(email: Option<String>, name: Option<String>, avatar_url: Option<String>) -> Result<User, String>`

- **Type**: Update
- **Description**: Updates user profile information. Only updates fields that are provided (Some values).
- **Parameters**:
  - `email`: Optional email address
  - `name`: Optional display name
  - `avatar_url`: Optional avatar image URL
- **Returns**: Updated User object or error message
- **Security**: Only allows users to update their own data

### Data Structures

```rust
pub struct User {
    pub id: u64,                      // Unique user identifier
    pub user_principal: Principal,    // Internet Computer principal ID
    pub email: Option<String>,        // User's email address (optional)
    pub name: String,                 // User's display name
    pub avatar_url: Option<String>,   // URL to user's avatar image (optional)
}
```

---

## Group Canister (To be implemented by colleague)

Manages sports groups and communities.

### Planned Endpoints

- `get_group_list() -> Vec<Group>`
- `search_group(query: String) -> Vec<Group>`
- `get_group_details(group_id: u64) -> Result<Group, String>`
- `create_group(group_data: Group) -> Result<u64, String>`
- `update_group(group_id: u64, updated_data: GroupUpdate) -> Result<(), String>`
- `delete_group(group_id: u64) -> Result<(), String>`
- `join_group(group_id: u64, user_id: u64) -> Result<(), String>`
- `leave_group(group_id: u64, user_id: u64) -> Result<(), String>`
- `get_group_members(group_id: u64) -> Vec<User>`
- `invite_user_to_group(group_id: u64, target_user_id: u64) -> Result<(), String>`

---

## Post Canister (Implemented)

Handles posts, comments, and interactions within groups.

### Endpoints

#### `create_post(group_id: u64, content: String, media_urls: Vec<String>) -> Result<u64, String>`

- **Type**: Update
- **Description**: Creates a new post in a specific group
- **Parameters**:
  - `group_id`: ID of the group where the post will be created
  - `content`: Post content/text
  - `media_urls`: List of URLs to attached media files
- **Returns**: New post ID or error message
- **Authentication**: Requires authenticated user

#### `delete_post(post_id: u64) -> Result<(), String>`

- **Type**: Update
- **Description**: Deletes a post (only by the author)
- **Parameters**:
  - `post_id`: ID of the post to delete
- **Returns**: Success confirmation or error message
- **Security**: Only the post author can delete the post

#### `edit_post(post_id: u64, new_content: String) -> Result<(), String>`

- **Type**: Update
- **Description**: Edits a post's content (only by the author)
- **Parameters**:
  - `post_id`: ID of the post to edit
  - `new_content`: New content for the post
- **Returns**: Success confirmation or error message
- **Security**: Only the post author can edit the post

#### `get_posts(group_id: u64) -> Vec<Post>`

- **Type**: Query
- **Description**: Retrieves all posts for a specific group
- **Parameters**:
  - `group_id`: ID of the group
- **Returns**: List of posts in the group

#### `get_unseen_posts(user_id: u64) -> Vec<Post>`

- **Type**: Query
- **Description**: Retrieves posts that the user hasn't seen yet
- **Parameters**:
  - `user_id`: ID of the user
- **Returns**: List of unseen posts

#### `seen_post(user_id: u64, post_id: u64) -> Result<(), String>`

- **Type**: Update
- **Description**: Marks a post as seen by a user
- **Parameters**:
  - `user_id`: ID of the user
  - `post_id`: ID of the post
- **Returns**: Success confirmation or error message

#### `like_post(post_id: u64, user_id: u64) -> Result<(), String>`

- **Type**: Update
- **Description**: Adds a like to a post (removes dislike if present)
- **Parameters**:
  - `post_id`: ID of the post to like
  - `user_id`: ID of the user liking the post
- **Returns**: Success confirmation or error message

#### `dislike_post(post_id: u64, user_id: u64) -> Result<(), String>`

- **Type**: Update
- **Description**: Adds a dislike to a post (removes like if present)
- **Parameters**:
  - `post_id`: ID of the post to dislike
  - `user_id`: ID of the user disliking the post
- **Returns**: Success confirmation or error message

#### `comment_on_post(post_id: u64, content: String, parent_comment_id: Option<u64>) -> Result<Comment, String>`

- **Type**: Update
- **Description**: Creates a comment on a post (supports nested comments)
- **Parameters**:
  - `post_id`: ID of the post to comment on
  - `content`: Comment content
  - `parent_comment_id`: Optional ID of parent comment for nested comments
- **Returns**: Created Comment object or error message

#### `delete_comment(comment_id: u64) -> Result<(), String>`

- **Type**: Update
- **Description**: Deletes a comment (only by the author)
- **Parameters**:
  - `comment_id`: ID of the comment to delete
- **Returns**: Success confirmation or error message
- **Security**: Only the comment author can delete the comment

#### `edit_comment(comment_id: u64, new_content: String) -> Result<(), String>`

- **Type**: Update
- **Description**: Edits a comment's content (only by the author)
- **Parameters**:
  - `comment_id`: ID of the comment to edit
  - `new_content`: New content for the comment
- **Returns**: Success confirmation or error message
- **Security**: Only the comment author can edit the comment

#### `get_post_comments(post_id: u64) -> Vec<Comment>`

- **Type**: Query
- **Description**: Retrieves all comments for a specific post
- **Parameters**:
  - `post_id`: ID of the post
- **Returns**: List of comments on the post

### Data Structures

```rust
pub struct Post {
    pub id: u64,                    // Unique post identifier
    pub group_id: u64,              // ID of the group this post belongs to
    pub author_id: u64,             // ID of the user who created the post
    pub content: String,            // Post content/text
    pub media_urls: Vec<String>,    // URLs to attached media files
    pub created_at: u64,            // Timestamp when post was created
    pub updated_at: Option<u64>,    // Timestamp when post was last updated
    pub likes: Vec<u64>,            // List of user IDs who liked this post
    pub dislikes: Vec<u64>,         // List of user IDs who disliked this post
    pub comment_count: u64,         // Number of comments on this post
}

pub struct Comment {
    pub id: u64,                    // Unique comment identifier
    pub post_id: u64,               // ID of the post this comment belongs to
    pub author_id: u64,             // ID of the user who created the comment
    pub content: String,            // Comment content/text
    pub parent_comment_id: Option<u64>, // ID of parent comment (for nested comments)
    pub created_at: u64,            // Timestamp when comment was created
    pub updated_at: Option<u64>,    // Timestamp when comment was last updated
    pub likes: Vec<u64>,            // List of user IDs who liked this comment
}
```

---

## Tal3a (Event) Canister (Implemented)

Handles sports events and activities.

### Endpoints

#### `create_tal3a(group_id: u64, title: String, description: String, sport_type: String, location: Location, date_time: u64, duration_minutes: u64, max_participants: u64, requirements: Vec<String>, entry_fee: Option<u64>, image_urls: Vec<String>) -> Result<u64, String>`

- **Type**: Update
- **Description**: Creates a new sports event (tal3a)
- **Parameters**:
  - `group_id`: ID of the group organizing the event
  - `title`: Event title
  - `description`: Event description
  - `sport_type`: Type of sport (football, basketball, etc.)
  - `location`: Event location details
  - `date_time`: Event date and time (timestamp)
  - `duration_minutes`: Expected duration in minutes
  - `max_participants`: Maximum number of participants allowed
  - `requirements`: List of requirements (skill level, equipment, etc.)
  - `entry_fee`: Optional entry fee
  - `image_urls`: URLs to event images
- **Returns**: New event ID or error message
- **Validation**: Title cannot be empty, date must be in future, max_participants > 0

#### `update_tal3a(tal3a_id: u64, updated_data: Tal3aUpdate) -> Result<(), String>`

- **Type**: Update
- **Description**: Updates an existing event (only by organizer)
- **Parameters**:
  - `tal3a_id`: ID of the event to update
  - `updated_data`: Partial update data
- **Returns**: Success confirmation or error message
- **Security**: Only the event organizer can update
- **Validation**: Cannot update completed or cancelled events

#### `delete_tal3a(tal3a_id: u64) -> Result<(), String>`

- **Type**: Update
- **Description**: Deletes an event (only by organizer)
- **Parameters**:
  - `tal3a_id`: ID of the event to delete
- **Returns**: Success confirmation or error message
- **Security**: Only the event organizer can delete
- **Validation**: Cannot delete events in progress

#### `join_tal3a(tal3a_id: u64, user_id: u64) -> Result<(), String>`

- **Type**: Update
- **Description**: Allows a user to join an event
- **Parameters**:
  - `tal3a_id`: ID of the event to join
  - `user_id`: ID of the user joining
- **Returns**: Success confirmation or error message
- **Logic**: Adds to participants if space available, otherwise adds to waiting list
- **Validation**: Can only join scheduled events

#### `leave_tal3a(tal3a_id: u64, user_id: u64) -> Result<(), String>`

- **Type**: Update
- **Description**: Allows a user to leave an event
- **Parameters**:
  - `tal3a_id`: ID of the event to leave
  - `user_id`: ID of the user leaving
- **Returns**: Success confirmation or error message
- **Logic**: Promotes waiting list users when participants leave

#### `review_tal3a(tal3a_id: u64, rating: u8, comment: String) -> Result<(), String>`

- **Type**: Update
- **Description**: Adds a review for a completed event
- **Parameters**:
  - `tal3a_id`: ID of the event to review
  - `rating`: Rating from 1-5 stars
  - `comment`: Review comment
- **Returns**: Success confirmation or error message
- **Validation**: Only participants can review, only after completion, rating 1-5

#### `comment_on_tal3a(tal3a_id: u64, content: String, parent_comment_id: Option<u64>) -> Result<EventComment, String>`

- **Type**: Update
- **Description**: Adds a comment to an event
- **Parameters**:
  - `tal3a_id`: ID of the event to comment on
  - `content`: Comment content
  - `parent_comment_id`: Optional parent comment for nested comments
- **Returns**: Created EventComment object or error message

#### `get_tal3a_participants(tal3a_id: u64) -> Result<Vec<u64>, String>`

- **Type**: Query
- **Description**: Retrieves the list of participants for an event
- **Parameters**:
  - `tal3a_id`: ID of the event
- **Returns**: List of participant user IDs or error message

#### `get_group_tal3as(group_id: u64) -> Vec<Tal3a>`

- **Type**: Query
- **Description**: Retrieves all events for a specific group
- **Parameters**:
  - `group_id`: ID of the group
- **Returns**: List of events organized by the group

#### `get_tal3a(tal3a_id: u64) -> Result<Tal3a, String>`

- **Type**: Query
- **Description**: Retrieves a specific event by ID
- **Parameters**:
  - `tal3a_id`: ID of the event
- **Returns**: Event object or error message

#### `get_tal3a_reviews(tal3a_id: u64) -> Vec<Review>`

- **Type**: Query
- **Description**: Retrieves all reviews for an event
- **Parameters**:
  - `tal3a_id`: ID of the event
- **Returns**: List of reviews for the event

#### `get_tal3a_comments(tal3a_id: u64) -> Vec<EventComment>`

- **Type**: Query
- **Description**: Retrieves all comments for an event
- **Parameters**:
  - `tal3a_id`: ID of the event
- **Returns**: List of comments on the event

#### `get_all_tal3as(sport_type: Option<String>, city: Option<String>, status: Option<EventStatus>, date_from: Option<u64>, date_to: Option<u64>) -> Vec<Tal3a>`

- **Type**: Query
- **Description**: Retrieves all events with optional filtering
- **Parameters**:
  - `sport_type`: Optional sport type filter
  - `city`: Optional city filter
  - `status`: Optional status filter
  - `date_from`: Optional start date filter
  - `date_to`: Optional end date filter
- **Returns**: Filtered list of events

### Data Structures

```rust
pub struct Tal3a {
    pub id: u64,                    // Unique event identifier
    pub group_id: u64,              // ID of the group organizing this event
    pub organizer_id: u64,          // ID of the user who created this event
    pub title: String,              // Event title
    pub description: String,        // Event description
    pub sport_type: String,         // Type of sport (football, basketball, etc.)
    pub location: Location,         // Event location details
    pub date_time: u64,             // Event date and time (timestamp)
    pub duration_minutes: u64,      // Expected duration in minutes
    pub max_participants: u64,      // Maximum number of participants allowed
    pub participants: Vec<u64>,     // List of user IDs who joined the event
    pub waiting_list: Vec<u64>,     // List of user IDs on waiting list
    pub requirements: Vec<String>,  // List of requirements (skill level, equipment, etc.)
    pub entry_fee: Option<u64>,     // Entry fee in smallest currency unit (optional)
    pub created_at: u64,            // Timestamp when event was created
    pub updated_at: Option<u64>,    // Timestamp when event was last updated
    pub status: EventStatus,        // Current status of the event
    pub reviews: Vec<u64>,          // List of review IDs for this event
    pub image_urls: Vec<String>,    // URLs to event images
}

pub struct Location {
    pub name: String,               // Venue name
    pub address: String,            // Full address
    pub city: String,               // City
    pub coordinates: Option<Coordinates>, // GPS coordinates (optional)
}

pub struct Coordinates {
    pub latitude: f64,              // Latitude
    pub longitude: f64,             // Longitude
}

pub enum EventStatus {
    Scheduled,      // Event is scheduled and accepting participants
    InProgress,     // Event is currently happening
    Completed,      // Event has finished
    Cancelled,      // Event was cancelled
    Postponed,      // Event was postponed
}

pub struct Review {
    pub id: u64,                    // Unique review identifier
    pub tal3a_id: u64,              // ID of the event being reviewed
    pub reviewer_id: u64,           // ID of the user who wrote the review
    pub rating: u8,                 // Rating from 1-5 stars
    pub comment: String,            // Review comment
    pub created_at: u64,            // Timestamp when review was created
}

pub struct EventComment {
    pub id: u64,                    // Unique comment identifier
    pub tal3a_id: u64,              // ID of the event this comment belongs to
    pub author_id: u64,             // ID of the user who created the comment
    pub content: String,            // Comment content/text
    pub parent_comment_id: Option<u64>, // ID of parent comment (for nested comments)
    pub created_at: u64,            // Timestamp when comment was created
    pub updated_at: Option<u64>,    // Timestamp when comment was last updated
}
```

---

## Security Considerations

### Authentication

- All endpoints require authenticated callers (non-anonymous principals)
- User identification is done through Internet Computer principals
- Cross-canister calls will be needed to verify user existence and permissions

### Authorization

- Users can only modify their own data (posts, comments, profiles)
- Event organizers have special permissions for their events
- Participants have specific permissions for events they joined

### Data Validation

- Input validation for all user-provided data
- Date validation for events (must be in future)
- Rating validation (1-5 stars)
- Content length and format validation

### Error Handling

- Comprehensive error messages for debugging
- Proper handling of edge cases (non-existent entities, permission denied, etc.)
- Graceful degradation when dependencies are unavailable

---

## Future Enhancements

### Inter-Canister Communication

- Implement proper user ID resolution from User Canister
- Add group validation from Group Canister
- Implement notification system between canisters

### Additional Features

- Search and filtering capabilities
- User reputation system
- Event recommendations
- Media file handling and storage
- Real-time notifications
- Payment integration for entry fees

### Performance Optimizations

- Implement proper serialization/deserialization for stable storage
- Add indexing for better query performance
- Implement pagination for large result sets
- Add caching mechanisms

---

## Development Notes

### TODO Items

1. Implement proper serialization/deserialization for Storable traits
2. Add inter-canister communication for user validation
3. Implement group validation before creating posts/events
4. Add comprehensive input validation
5. Implement proper error handling and logging
6. Add unit tests for all endpoints
7. Implement pagination for list endpoints
8. Add proper access control and permissions
9. Implement notification system
10. Add search and filtering capabilities

### Testing Strategy

- Unit tests for all business logic
- Integration tests for inter-canister communication
- Load testing for performance validation
- Security testing for access control
- End-to-end testing with frontend integration
