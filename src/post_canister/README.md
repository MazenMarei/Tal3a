# Post Canister 📝

The Post Canister is built using **Azle** (TypeScript/JavaScript for Internet Computer) to manage posts and comments in the Tal3a platform.

## 🎯 Core Features

### 📝 Post Management

- `create_post(post_data: string)` - Create a new post
- `delete_post(post_id: nat64)` - Delete a post
- `edit_post(post_id: nat64, new_content: string)` - Edit post content
- `get_posts(group_id: nat64)` - Get posts from a specific group
- `get_unseen_posts(user_id: string)` - Get unseen posts for a user
- `like_post(post_id: nat64, user_id: string)` - Like a post
- `dislike_post(post_id: nat64, user_id: string)` - Dislike a post

### 💬 Comment Management

- `comment_on_post(post_id: nat64, content: string, parent_comment_id?: nat64)` - Comment on a post or reply to a comment
- `delete_comment(comment_id: nat64)` - Delete a comment
- `edit_comment(comment_id: nat64, new_content: string)` - Edit a comment
- `like_comment(comment_id: nat64, user_id: string)` - Like a comment
- `dislike_comment(comment_id: nat64, user_id: string)` - Dislike a comment

### 👁️ Seen Status Management

- `seen_post(user_id: string, post_id: nat64)` - Mark a post as seen
- `get_seen_posts(user_id: string)` - Get seen posts for a user
- `is_post_seen(user_id: string, post_id: nat64)` - Check if a post is seen
- `get_post_seen_count(post_id: nat64)` - Get post view count

### 🔍 Query Functions

- `get_post_by_id(post_id: nat64)` - Get a specific post
- `get_post_comments(post_id: nat64)` - Get comments for a post
- `get_filtered_posts(filter: string)` - Get filtered posts
- `get_user_posts(user_id: string)` - Get posts created by a user

## 🏗️ Data Structure

### Post Structure (JSON Format)

```json
{
  "id": "1",
  "author_id": "user123",
  "group_id": "1",
  "content": "Welcome to the football community! ⚽",
  "post_type": "Text",
  "visibility": "Public",
  "media_attachments": [],
  "tags": ["football", "egypt"],
  "mentioned_users": [],
  "reactions": [],
  "comments": [],
  "shares_count": "0",
  "created_at": "1692172800000000000",
  "updated_at": "1692172800000000000",
  "is_deleted": false,
  "edited": false,
  "pinned": false,
  "sport_related": "Football"
}
```

### Comment Structure (JSON Format)

```json
{
  "id": "1",
  "post_id": "1",
  "author_id": "user456",
  "content": "Great post! 👍",
  "parent_comment_id": null,
  "replies": [],
  "reactions": [],
  "created_at": "1692172800000000000",
  "updated_at": "1692172800000000000",
  "is_deleted": false,
  "edited": false
}
```

## 🔧 Advanced Features

### 🏷️ Post Types

- **Text**: Regular text post
- **Image**: Post with images
- **Video**: Post with videos
- **Poll**: Opinion poll
- **Event**: Sports event-related post

### 🔒 Privacy Levels

- **Public**: Visible to all users
- **GroupOnly**: Visible to group members only
- **Private**: Visible to author only

### ⚽ Sports Integration

- Each post can be linked to a specific sport
- Helps with filtering and search
- Supports all sports available on the platform

### 📊 Interactions & Analytics

- Likes and dislikes
- Nested comments (replies)
- View statistics
- Hashtag and mention system

## 🚀 Usage Examples

### Creating a New Post

```typescript
const postData = {
  content: "Welcome to the football community! ⚽",
  group_id: "1",
  media_urls: [],
  sport_type: "Football",
  location: "Cairo, Egypt",
  is_event_related: "false",
};

const result = await post_canister.create_post(JSON.stringify(postData));
```

### Commenting on a Post

```typescript
const result = await post_canister.comment_on_post(
  1n, // post_id
  "Great post! 👍", // content
  null // parent_comment_id (optional)
);
```

### Marking a Post as Seen

```typescript
const result = await post_canister.seen_post(
  "user123", // user_id
  1n // post_id
);
```

### Getting Filtered Posts

```typescript
const filter = {
  group_id: "1",
  sport_type: "Football",
  location: "Cairo",
};

const posts = await post_canister.get_filtered_posts(JSON.stringify(filter));
```

## 📁 File Structure

```
src/post_canister/
├── index.ts                    # Main canister entry point
├── package.json               # Project configuration
├── tsconfig.json             # TypeScript configuration
├── src/
│   ├── types.ts              # Data type definitions
│   ├── storage.ts            # Storage management
│   ├── utils.ts              # Utility functions
│   └── services/
│       ├── post_service.ts   # Post services
│       ├── comment_service.ts # Comment services
│       └── seen_service.ts   # Seen status services
```

## 🔗 Integration with Project

The Post Canister integrates with:

- **User Canister** (Rust) - For user data management
- **Tal3a Canister** (Azle) - For sports events management
- **Frontend** (React) - For user interface

## 🛡️ Security & Validation

- Content validation
- Post and comment ownership verification
- Protection against deleted content access
- Access permission checks

## 📈 Available Statistics

- Total posts count
- Total comments count
- User seen statistics
- Post view counts

## 🧪 Testing

### Building the Canister

```bash
cd /home/latif/ICP/Tal3a
dfx build post_canister
```

### Deploying Locally

```bash
dfx start --clean --background
dfx deploy post_canister
```

### Health Check

```bash
dfx canister call post_canister health_check
```

## � API Response Format

All API functions return JSON strings with the following format:

### Success Response

```json
{
  "success": true,
  "data": {
    /* response data */
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message description"
}
```

## 🔧 Development Setup

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Start Local Replica**

   ```bash
   dfx start --clean --background
   ```

3. **Deploy Canister**

   ```bash
   dfx deploy post_canister
   ```

4. **Generate Declarations**
   ```bash
   dfx generate
   ```

## 🌟 Key Features Highlights

- ✅ **JSON-based API** - Easy integration with frontend
- ✅ **Azle Experimental** - Latest Internet Computer features
- ✅ **Type-safe** - TypeScript for better development experience
- ✅ **Scalable Storage** - StableBTreeMap for persistent data
- ✅ **Sports Integration** - Deep integration with sports ecosystem
- ✅ **Social Features** - Complete social media functionality

---

**Built with ❤️ using Azle & Internet Computer**
