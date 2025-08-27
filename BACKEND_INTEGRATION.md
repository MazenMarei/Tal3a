# Tal3a Backend Integration - COMPLETED ✅

This project demonstrates a complete integration between a React frontend and Internet Computer (ICP) backend canisters using Internet Identity for authentication.

## 🚀 **INTEGRATION STATUS: COMPLETE**

✅ **Internet Identity Authentication** - Fully integrated
✅ **User Canister Integration** - Complete with profile management
✅ **Event Canister Integration** - Full events system connected
✅ **Social Canister Integration** - Groups and posts fully functional
✅ **Dynamic Data Loading** - All frontend data now comes from backend
✅ **Error Handling & Loading States** - Comprehensive UX
✅ **Compatibility Layer** - Existing components continue working
✅ **Environment Configuration** - Ready for local/production deployment

## Architecture

The application consists of:

### Backend Canisters

- **User Canister**: Manages user profiles, authentication, and activities
- **Event Canister**: Handles sports events creation, joining, and management
- **Social Canister**: Manages groups, posts, and social interactions

### Frontend Integration

- **AuthContext**: Handles Internet Identity authentication and actor initialization
- **UserContext**: Manages user profile data and operations
- **EventsContext**: Handles event-related operations
- **SocialContext**: Manages social features (groups and posts)
- **DataContext**: Provides unified access to all backend data

## Key Features

### Authentication

- Internet Identity integration for secure authentication
- Automatic actor initialization for all canisters
- Persistent login state management

### User Management

- Profile creation and updates
- User activities tracking
- Governorate and city data management
- Notifications system

### Events System

- Create and manage sports events
- Join/leave events functionality
- Event filtering and search
- Participant management
- Event reviews and ratings

### Social Features

- Create and join groups
- Post creation and management
- Like/unlike functionality
- Group-based discussions
- Public and private groups

## File Structure

```
src/
├── context/
│   ├── AuthContext.jsx         # Internet Identity authentication
│   ├── UserContext.jsx         # User profile management
│   ├── EventsContext.jsx       # Events management
│   ├── SocialContext.jsx       # Social features
│   └── DataContext.jsx         # Unified data access
├── hooks/
│   └── useCanisterHooks.js     # Custom hooks for contexts
├── pages/
│   ├── whoami.jsx              # Authentication test page
│   └── IntegrationExample.jsx  # Complete integration demo
└── declarations/               # Generated canister interfaces
    ├── user_canister/
    ├── event_canister/
    └── social_canister/
```

## Environment Configuration

The application uses environment variables for canister configuration:

```env
# Local Development
DFX_NETWORK=local
CANISTER_ID_USER_CANISTER=your-local-user-canister-id
CANISTER_ID_EVENT_CANISTER=your-local-event-canister-id
CANISTER_ID_SOCIAL_CANISTER=your-local-social-canister-id

# Production
DFX_NETWORK=ic
CANISTER_ID_USER_CANISTER=bhg4e-ziaaa-aaaai-atlfq-cai
CANISTER_ID_EVENT_CANISTER=bval5-vyaaa-aaaai-atlgq-cai
CANISTER_ID_SOCIAL_CANISTER=bsbnj-yaaaa-aaaai-atlga-cai
```

## Usage Examples

### Authentication

```jsx
import { useAuth } from "../hooks/useCanisterHooks";

const Component = () => {
  const { isAuthenticated, login, logout, principal } = useAuth();

  return (
    <div>
      {!isAuthenticated ? (
        <button onClick={login}>Login with Internet Identity</button>
      ) : (
        <div>
          <p>Welcome! Principal: {principal?.toString()}</p>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
};
```

### User Profile

```jsx
import { useUser } from "../hooks/useCanisterHooks";

const ProfileComponent = () => {
  const { user, createUser, updateProfile } = useUser();

  const handleCreateProfile = async () => {
    const result = await createUser({
      username: "john_doe",
      bio: ["Sports enthusiast"],
      governorate: 1,
      city: 1,
      sports: ["Football", "Basketball"],
      avatar_url: [],
      free_days: [],
    });

    if (result.success) {
      console.log("Profile created:", result.user);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <h2>{user.username}</h2>
          <p>Sports: {user.sports?.join(", ")}</p>
        </div>
      ) : (
        <button onClick={handleCreateProfile}>Create Profile</button>
      )}
    </div>
  );
};
```

### Events Management

```jsx
import { useEvents } from "../hooks/useCanisterHooks";

const EventsComponent = () => {
  const { events, createEvent, joinEvent } = useEvents();

  const handleCreateEvent = async () => {
    const result = await createEvent({
      title: "Football Match",
      description: ["Join us for a friendly game"],
      sport: { Football: null },
      event_date: BigInt(new Date().getTime() * 1000000),
      duration_hours: 2,
      location: {
        governorate: 1,
        city: 1,
        description: "Sports Center",
      },
      cost_per_person: [BigInt(50)],
      max_participants: [16],
      requirements: ["Bring your boots"],
      images: [],
    });

    if (result.success) {
      console.log("Event created:", result.event);
    }
  };

  return (
    <div>
      <button onClick={handleCreateEvent}>Create Event</button>
      <div>
        {events.map((event) => (
          <div key={event.id}>
            <h3>{event.title}</h3>
            <p>Sport: {Object.keys(event.sport)[0]}</p>
            <button onClick={() => joinEvent(event.id)}>Join Event</button>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Social Features

```jsx
import { useSocial } from "../hooks/useCanisterHooks";

const SocialComponent = () => {
  const { groups, posts, createGroup, createPost, likePost } = useSocial();

  const handleCreateGroup = async () => {
    const result = await createGroup({
      name: "Cairo Football Club",
      description: "For football enthusiasts in Cairo",
      sport_type: { Football: null },
      governorate_id: 1,
      city_id: 1,
      public: true,
      parent_group_id: [],
      image: [],
    });

    if (result.success) {
      console.log("Group created:", result.group);
    }
  };

  return (
    <div>
      <button onClick={handleCreateGroup}>Create Group</button>
      <div>
        {groups.map((group) => (
          <div key={group.id}>
            <h3>{group.name}</h3>
            <p>{group.description}</p>
            <p>Members: {group.members}</p>
          </div>
        ))}
      </div>
      <div>
        {posts.map((post) => (
          <div key={post.post_id}>
            <p>{post.content}</p>
            <p>Likes: {post.likes.toString()}</p>
            <button onClick={() => likePost(post.post_id)}>Like</button>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## Testing the Integration

1. Visit `/whoami` to test authentication and backend connectivity
2. Visit `/integration` to see a complete integration example
3. Use the browser's developer tools to monitor backend calls

## Backend Functions Available

### User Canister

- `get_current_user()` - Get authenticated user data
- `create_user(RegisteringUser)` - Create new user profile
- `update_profile(UpdatingUser)` - Update user profile
- `add_activity(UserActivity)` - Add user activity
- `get_all_governorates()` - Get all governorates
- `get_all_cities_in_governorate(nat8)` - Get cities in governorate
- `add_notification(NewNotification)` - Add user notification
- `mark_notification_as_read(text)` - Mark notification as read

### Event Canister

- `get_all_events()` - Get all events
- `create_event(CreateEventInput)` - Create new event
- `join_event(nat64)` - Join an event
- `leave_event(nat64)` - Leave an event
- `update_event(nat64, EventUpdate)` - Update event
- `filter_events(EventFilter)` - Filter events
- `get_event_participants(nat64)` - Get event participants
- `review_event(nat64, nat8, opt text)` - Review an event

### Social Canister

- `filter_groups(GroupFilter)` - Filter groups
- `create_group(CreatingGroup)` - Create new group
- `join_group(text)` - Join a group
- `leave_group(text)` - Leave a group
- `get_group_posts(text)` - Get posts in group
- `create_post(NewPost)` - Create new post
- `like(LikeTarget)` - Like a post
- `unlike(LikeTarget)` - Unlike a post
- `get_unseen_posts()` - Get unseen posts

## Error Handling

All context providers include comprehensive error handling:

- Toast notifications for user feedback
- Loading states for better UX
- Error logging for debugging
- Graceful fallbacks when services are unavailable

## Development Setup

1. Install dependencies: `npm install`
2. Start local IC replica: `dfx start`
3. Deploy canisters: `dfx deploy`
4. Generate declarations: `dfx generate`
5. Start frontend: `npm run dev`

## Production Deployment

The application is configured for deployment to the Internet Computer mainnet using the canister IDs specified in `dfx.json`.

## Security Considerations

- Internet Identity provides secure, anonymous authentication
- Principal IDs are used for user identification
- All backend operations require authentication
- User data is stored securely on the IC blockchain
