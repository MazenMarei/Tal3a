// Tal3a (Event) Canister - Handles sports events and activities
use candid::CandidType;
use ic_cdk::{query, update};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap, Storable};
use ic_stable_structures::storable::Bound;
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::borrow::Cow;
use std::time::{SystemTime, UNIX_EPOCH};

// Type alias for virtual memory
type Memory = VirtualMemory<DefaultMemoryImpl>;

// Tal3a (Event) struct representing a sports event
#[derive(Clone, CandidType, Deserialize, Serialize)]
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

// Location struct for event venue information
#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct Location {
    pub name: String,               // Venue name
    pub address: String,            // Full address
    pub city: String,               // City
    pub coordinates: Option<Coordinates>, // GPS coordinates (optional)
}

// GPS coordinates
#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct Coordinates {
    pub latitude: f64,              // Latitude
    pub longitude: f64,             // Longitude
}

// Event status enum
#[derive(Clone, CandidType, Deserialize, Serialize)]
pub enum EventStatus {
    Scheduled,      // Event is scheduled and accepting participants
    InProgress,     // Event is currently happening
    Completed,      // Event has finished
    Cancelled,      // Event was cancelled
    Postponed,      // Event was postponed
}

// Review struct for event reviews
#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct Review {
    pub id: u64,                    // Unique review identifier
    pub tal3a_id: u64,              // ID of the event being reviewed
    pub reviewer_id: u64,           // ID of the user who wrote the review
    pub rating: u8,                 // Rating from 1-5 stars
    pub comment: String,            // Review comment
    pub created_at: u64,            // Timestamp when review was created
}

// Comment struct for event comments
#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct EventComment {
    pub id: u64,                    // Unique comment identifier
    pub tal3a_id: u64,              // ID of the event this comment belongs to
    pub author_id: u64,             // ID of the user who created the comment
    pub content: String,            // Comment content/text
    pub parent_comment_id: Option<u64>, // ID of parent comment (for nested comments)
    pub created_at: u64,            // Timestamp when comment was created
    pub updated_at: Option<u64>,    // Timestamp when comment was last updated
}

// Tal3a update struct for partial updates
#[derive(Clone, CandidType, Deserialize)]
pub struct Tal3aUpdate {
    pub title: Option<String>,
    pub description: Option<String>,
    pub location: Option<Location>,
    pub date_time: Option<u64>,
    pub duration_minutes: Option<u64>,
    pub max_participants: Option<u64>,
    pub requirements: Option<Vec<String>>,
    pub entry_fee: Option<Option<u64>>, // Option<Option<u64>> to allow setting to None
    pub status: Option<EventStatus>,
    pub image_urls: Option<Vec<String>>,
}

// Implementing Storable trait for Tal3a
impl Storable for Tal3a {
    fn to_bytes(&self) -> Cow<'_, [u8]> {
        // TODO: Implement proper serialization using serde
        Cow::Owned(Vec::new())
    }

    fn into_bytes(self) -> Vec<u8> {
        // TODO: Implement proper serialization using serde
        Vec::new()
    }

    fn from_bytes(_bytes: Cow<[u8]>) -> Self {
        // TODO: Implement proper deserialization using serde
        Tal3a {
            id: 0,
            group_id: 0,
            organizer_id: 0,
            title: String::new(),
            description: String::new(),
            sport_type: String::new(),
            location: Location {
                name: String::new(),
                address: String::new(),
                city: String::new(),
                coordinates: None,
            },
            date_time: 0,
            duration_minutes: 0,
            max_participants: 0,
            participants: Vec::new(),
            waiting_list: Vec::new(),
            requirements: Vec::new(),
            entry_fee: None,
            created_at: 0,
            updated_at: None,
            status: EventStatus::Scheduled,
            reviews: Vec::new(),
            image_urls: Vec::new(),
        }
    }

    const BOUND: Bound = Bound::Unbounded;
}

// Implementing Storable trait for Review
impl Storable for Review {
    fn to_bytes(&self) -> Cow<'_, [u8]> {
        // TODO: Implement proper serialization using serde
        Cow::Owned(Vec::new())
    }

    fn into_bytes(self) -> Vec<u8> {
        // TODO: Implement proper serialization using serde
        Vec::new()
    }

    fn from_bytes(_bytes: Cow<[u8]>) -> Self {
        // TODO: Implement proper deserialization using serde
        Review {
            id: 0,
            tal3a_id: 0,
            reviewer_id: 0,
            rating: 1,
            comment: String::new(),
            created_at: 0,
        }
    }

    const BOUND: Bound = Bound::Unbounded;
}

// Implementing Storable trait for EventComment
impl Storable for EventComment {
    fn to_bytes(&self) -> Cow<'_, [u8]> {
        // TODO: Implement proper serialization using serde
        Cow::Owned(Vec::new())
    }

    fn into_bytes(self) -> Vec<u8> {
        // TODO: Implement proper serialization using serde
        Vec::new()
    }

    fn from_bytes(_bytes: Cow<[u8]>) -> Self {
        // TODO: Implement proper deserialization using serde
        EventComment {
            id: 0,
            tal3a_id: 0,
            author_id: 0,
            content: String::new(),
            parent_comment_id: None,
            created_at: 0,
            updated_at: None,
        }
    }

    const BOUND: Bound = Bound::Unbounded;
}

// Thread-local storage for managing event canister state
thread_local! {
    // Memory manager for handling stable storage
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    // Stable BTree map for storing events (tal3as)
    static TAL3AS: RefCell<StableBTreeMap<u64, Tal3a, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(20))), // Memory ID 20 for Events
        )
    );

    // Stable BTree map for storing reviews
    static REVIEWS: RefCell<StableBTreeMap<u64, Review, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(21))), // Memory ID 21 for Reviews
        )
    );

    // Stable BTree map for storing event comments
    static EVENT_COMMENTS: RefCell<StableBTreeMap<u64, EventComment, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(22))), // Memory ID 22 for Event Comments
        )
    );

    // Counters for generating unique IDs
    static NEXT_TAL3A_ID: RefCell<u64> = RefCell::new(1);
    static NEXT_REVIEW_ID: RefCell<u64> = RefCell::new(1);
    static NEXT_COMMENT_ID: RefCell<u64> = RefCell::new(1);
}

// Helper function to get current timestamp
fn current_timestamp() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs()
}

// Helper function to get caller's user ID
// Note: This would need to interact with User Canister to get user ID from Principal
fn get_caller_user_id() -> Result<u64, String> {
    let _caller = ic_cdk::caller();
    // TODO: Implement inter-canister call to User Canister to get user ID
    // For now, return a placeholder
    Ok(1)
}

// Create a new tal3a (event)
#[update]
pub fn create_tal3a(
    group_id: u64,
    title: String,
    description: String,
    sport_type: String,
    location: Location,
    date_time: u64,
    duration_minutes: u64,
    max_participants: u64,
    requirements: Vec<String>,
    entry_fee: Option<u64>,
    image_urls: Vec<String>,
) -> Result<u64, String> {
    let organizer_id = get_caller_user_id()?;
    
    // Validate input
    if title.trim().is_empty() {
        return Err("Event title cannot be empty".to_string());
    }
    
    if date_time <= current_timestamp() {
        return Err("Event date must be in the future".to_string());
    }
    
    if max_participants == 0 {
        return Err("Maximum participants must be greater than 0".to_string());
    }

    // Generate new event ID
    let tal3a_id = NEXT_TAL3A_ID.with(|id| {
        let mut next_id = id.borrow_mut();
        let current_id = *next_id;
        *next_id += 1;
        current_id
    });

    // Create new event
    let tal3a = Tal3a {
        id: tal3a_id,
        group_id,
        organizer_id,
        title,
        description,
        sport_type,
        location,
        date_time,
        duration_minutes,
        max_participants,
        participants: Vec::new(),
        waiting_list: Vec::new(),
        requirements,
        entry_fee,
        created_at: current_timestamp(),
        updated_at: None,
        status: EventStatus::Scheduled,
        reviews: Vec::new(),
        image_urls,
    };

    // Store the event
    TAL3AS.with(|tal3as| {
        tal3as.borrow_mut().insert(tal3a_id, tal3a);
    });

    Ok(tal3a_id)
}

// Update an existing tal3a (only by organizer)
#[update]
pub fn update_tal3a(tal3a_id: u64, updated_data: Tal3aUpdate) -> Result<(), String> {
    let caller_user_id = get_caller_user_id()?;

    TAL3AS.with(|tal3as| {
        let mut tal3as_map = tal3as.borrow_mut();
        match tal3as_map.get(&tal3a_id) {
            Some(mut tal3a) => {
                // Check if caller is the organizer
                if tal3a.organizer_id != caller_user_id {
                    return Err("Only the event organizer can update this event".to_string());
                }

                // Check if event can still be updated
                match tal3a.status {
                    EventStatus::Completed | EventStatus::Cancelled => {
                        return Err("Cannot update completed or cancelled events".to_string());
                    }
                    _ => {}
                }

                // Update fields if provided
                if let Some(title) = updated_data.title {
                    if title.trim().is_empty() {
                        return Err("Event title cannot be empty".to_string());
                    }
                    tal3a.title = title;
                }
                
                if let Some(description) = updated_data.description {
                    tal3a.description = description;
                }
                
                if let Some(location) = updated_data.location {
                    tal3a.location = location;
                }
                
                if let Some(date_time) = updated_data.date_time {
                    if date_time <= current_timestamp() {
                        return Err("Event date must be in the future".to_string());
                    }
                    tal3a.date_time = date_time;
                }
                
                if let Some(duration_minutes) = updated_data.duration_minutes {
                    tal3a.duration_minutes = duration_minutes;
                }
                
                if let Some(max_participants) = updated_data.max_participants {
                    if max_participants == 0 {
                        return Err("Maximum participants must be greater than 0".to_string());
                    }
                    // If reducing max participants, move excess to waiting list
                    if max_participants < tal3a.participants.len() as u64 {
                        let moved_to_waiting: Vec<u64> = tal3a.participants.drain(max_participants as usize..).collect();
                        tal3a.waiting_list.extend(moved_to_waiting);
                    }
                    tal3a.max_participants = max_participants;
                }
                
                if let Some(requirements) = updated_data.requirements {
                    tal3a.requirements = requirements;
                }
                
                if let Some(entry_fee) = updated_data.entry_fee {
                    tal3a.entry_fee = entry_fee;
                }
                
                if let Some(status) = updated_data.status {
                    tal3a.status = status;
                }
                
                if let Some(image_urls) = updated_data.image_urls {
                    tal3a.image_urls = image_urls;
                }

                tal3a.updated_at = Some(current_timestamp());
                tal3as_map.insert(tal3a_id, tal3a);
                Ok(())
            }
            None => Err("Event not found".to_string()),
        }
    })
}

// Delete a tal3a (only by organizer)
#[update]
pub fn delete_tal3a(tal3a_id: u64) -> Result<(), String> {
    let caller_user_id = get_caller_user_id()?;

    let tal3a = TAL3AS.with(|tal3as| {
        tal3as.borrow().get(&tal3a_id)
    });

    match tal3a {
        Some(tal3a) => {
            if tal3a.organizer_id != caller_user_id {
                return Err("Only the event organizer can delete this event".to_string());
            }
            
            // Check if event can be deleted
            match tal3a.status {
                EventStatus::InProgress => {
                    return Err("Cannot delete an event that is in progress".to_string());
                }
                _ => {}
            }
            
            // Remove the event
            TAL3AS.with(|tal3as| {
                tal3as.borrow_mut().remove(&tal3a_id);
            });
            
            // TODO: Also remove all reviews and comments associated with this event
            
            Ok(())
        }
        None => Err("Event not found".to_string()),
    }
}

// Join a tal3a (event)
#[update]
pub fn join_tal3a(tal3a_id: u64, user_id: u64) -> Result<(), String> {
    TAL3AS.with(|tal3as| {
        let mut tal3as_map = tal3as.borrow_mut();
        match tal3as_map.get(&tal3a_id) {
            Some(mut tal3a) => {
                // Check if event is still accepting participants
                match tal3a.status {
                    EventStatus::Scheduled => {},
                    EventStatus::InProgress => return Err("Cannot join an event that is in progress".to_string()),
                    EventStatus::Completed => return Err("Cannot join a completed event".to_string()),
                    EventStatus::Cancelled => return Err("Cannot join a cancelled event".to_string()),
                    EventStatus::Postponed => return Err("Cannot join a postponed event".to_string()),
                }

                // Check if user is already a participant
                if tal3a.participants.contains(&user_id) {
                    return Err("User is already a participant".to_string());
                }

                // Check if user is on waiting list
                if tal3a.waiting_list.contains(&user_id) {
                    return Err("User is already on the waiting list".to_string());
                }

                // Check if there's space available
                if tal3a.participants.len() < tal3a.max_participants as usize {
                    // Add to participants
                    tal3a.participants.push(user_id);
                } else {
                    // Add to waiting list
                    tal3a.waiting_list.push(user_id);
                }

                tal3as_map.insert(tal3a_id, tal3a);
                Ok(())
            }
            None => Err("Event not found".to_string()),
        }
    })
}

// Leave a tal3a (event)
#[update]
pub fn leave_tal3a(tal3a_id: u64, user_id: u64) -> Result<(), String> {
    TAL3AS.with(|tal3as| {
        let mut tal3as_map = tal3as.borrow_mut();
        match tal3as_map.get(&tal3a_id) {
            Some(mut tal3a) => {
                // Remove from participants if present
                let was_participant = tal3a.participants.contains(&user_id);
                tal3a.participants.retain(|&id| id != user_id);
                
                // Remove from waiting list if present
                tal3a.waiting_list.retain(|&id| id != user_id);

                // If user was a participant and there are people on waiting list, promote one
                if was_participant && !tal3a.waiting_list.is_empty() {
                    let promoted_user = tal3a.waiting_list.remove(0);
                    tal3a.participants.push(promoted_user);
                }

                tal3as_map.insert(tal3a_id, tal3a);
                Ok(())
            }
            None => Err("Event not found".to_string()),
        }
    })
}

// Add a review for a tal3a (only after event completion)
#[update]
pub fn review_tal3a(tal3a_id: u64, rating: u8, comment: String) -> Result<(), String> {
    let reviewer_id = get_caller_user_id()?;
    
    // Validate rating
    if rating < 1 || rating > 5 {
        return Err("Rating must be between 1 and 5".to_string());
    }

    // Check if event exists and is completed
    let tal3a = TAL3AS.with(|tal3as| {
        tal3as.borrow().get(&tal3a_id)
    });

    match tal3a {
        Some(tal3a) => {
            // Check if event is completed
            match tal3a.status {
                EventStatus::Completed => {},
                _ => return Err("Can only review completed events".to_string()),
            }

            // Check if user was a participant
            if !tal3a.participants.contains(&reviewer_id) {
                return Err("Only participants can review the event".to_string());
            }

            // Check if user has already reviewed this event
            let existing_review = REVIEWS.with(|reviews| {
                for entry in reviews.borrow().iter() {
                    let review = entry.value();
                    if review.tal3a_id == tal3a_id && review.reviewer_id == reviewer_id {
                        return true;
                    }
                }
                false
            });

            if existing_review {
                return Err("User has already reviewed this event".to_string());
            }

            // Generate new review ID
            let review_id = NEXT_REVIEW_ID.with(|id| {
                let mut next_id = id.borrow_mut();
                let current_id = *next_id;
                *next_id += 1;
                current_id
            });

            // Create new review
            let review = Review {
                id: review_id,
                tal3a_id,
                reviewer_id,
                rating,
                comment,
                created_at: current_timestamp(),
            };

            // Store the review
            REVIEWS.with(|reviews| {
                reviews.borrow_mut().insert(review_id, review);
            });

            // Add review ID to the event
            TAL3AS.with(|tal3as| {
                let mut tal3as_map = tal3as.borrow_mut();
                if let Some(mut tal3a) = tal3as_map.get(&tal3a_id) {
                    tal3a.reviews.push(review_id);
                    tal3as_map.insert(tal3a_id, tal3a);
                }
            });

            Ok(())
        }
        None => Err("Event not found".to_string()),
    }
}

// Comment on a tal3a (event)
#[update]
pub fn comment_on_tal3a(tal3a_id: u64, content: String, parent_comment_id: Option<u64>) -> Result<EventComment, String> {
    let author_id = get_caller_user_id()?;

    // Check if event exists
    let event_exists = TAL3AS.with(|tal3as| {
        tal3as.borrow().contains_key(&tal3a_id)
    });

    if !event_exists {
        return Err("Event not found".to_string());
    }

    // If parent_comment_id is provided, check if it exists
    if let Some(parent_id) = parent_comment_id {
        let parent_exists = EVENT_COMMENTS.with(|comments| {
            comments.borrow().contains_key(&parent_id)
        });
        
        if !parent_exists {
            return Err("Parent comment not found".to_string());
        }
    }

    // Generate new comment ID
    let comment_id = NEXT_COMMENT_ID.with(|id| {
        let mut next_id = id.borrow_mut();
        let current_id = *next_id;
        *next_id += 1;
        current_id
    });

    // Create new comment
    let comment = EventComment {
        id: comment_id,
        tal3a_id,
        author_id,
        content,
        parent_comment_id,
        created_at: current_timestamp(),
        updated_at: None,
    };

    // Store the comment
    EVENT_COMMENTS.with(|comments| {
        comments.borrow_mut().insert(comment_id, comment.clone());
    });

    Ok(comment)
}

// Get participants of a tal3a (event)
#[query]
pub fn get_tal3a_participants(tal3a_id: u64) -> Result<Vec<u64>, String> {
    TAL3AS.with(|tal3as| {
        match tal3as.borrow().get(&tal3a_id) {
            Some(tal3a) => Ok(tal3a.participants.clone()),
            None => Err("Event not found".to_string()),
        }
    })
}

// Get all tal3as (events) for a specific group
#[query]
pub fn get_group_tal3as(group_id: u64) -> Vec<Tal3a> {
    TAL3AS.with(|tal3as| {
        let mut result = Vec::new();
        for entry in tal3as.borrow().iter() {
            let tal3a = entry.value();
            if tal3a.group_id == group_id {
                result.push(tal3a);
            }
        }
        result
    })
}

// Get a specific tal3a (event) by ID
#[query]
pub fn get_tal3a(tal3a_id: u64) -> Result<Tal3a, String> {
    TAL3AS.with(|tal3as| {
        match tal3as.borrow().get(&tal3a_id) {
            Some(tal3a) => Ok(tal3a),
            None => Err("Event not found".to_string()),
        }
    })
}

// Get reviews for a specific tal3a (event)
#[query]
pub fn get_tal3a_reviews(tal3a_id: u64) -> Vec<Review> {
    REVIEWS.with(|reviews| {
        let mut result = Vec::new();
        for entry in reviews.borrow().iter() {
            let review = entry.value();
            if review.tal3a_id == tal3a_id {
                result.push(review);
            }
        }
        result
    })
}

// Get comments for a specific tal3a (event)
#[query]
pub fn get_tal3a_comments(tal3a_id: u64) -> Vec<EventComment> {
    EVENT_COMMENTS.with(|comments| {
        let mut result = Vec::new();
        for entry in comments.borrow().iter() {
            let comment = entry.value();
            if comment.tal3a_id == tal3a_id {
                result.push(comment);
            }
        }
        result
    })
}

// Get all tal3as (events) - with optional filters
#[query]
pub fn get_all_tal3as(
    sport_type: Option<String>,
    city: Option<String>,
    status: Option<EventStatus>,
    date_from: Option<u64>,
    date_to: Option<u64>,
) -> Vec<Tal3a> {
    TAL3AS.with(|tal3as| {
        let mut result = Vec::new();
        for entry in tal3as.borrow().iter() {
            let tal3a = entry.value();
            
            // Filter by sport type if provided
            if let Some(ref sport) = sport_type {
                if tal3a.sport_type != *sport {
                    continue;
                }
            }
            
            // Filter by city if provided
            if let Some(ref city) = city {
                if tal3a.location.city != *city {
                    continue;
                }
            }
            
            // Filter by status if provided
            if let Some(ref status) = status {
                if std::mem::discriminant(&tal3a.status) != std::mem::discriminant(status) {
                    continue;
                }
            }
            
            // Filter by date range if provided
            if let Some(from) = date_from {
                if tal3a.date_time < from {
                    continue;
                }
            }
            
            if let Some(to) = date_to {
                if tal3a.date_time > to {
                    continue;
                }
            }
            
            result.push(tal3a);
        }
        result
    })
}
