// Post Canister - Handles posts, comments, and interactions within groups
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

// Post struct representing a post within a group
#[derive(Clone, CandidType, Deserialize, Serialize)]
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

// Comment struct representing a comment on a post
#[derive(Clone, CandidType, Deserialize, Serialize)]
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

// PostView struct to track which posts a user has seen
#[derive(Clone, CandidType, Deserialize, Serialize)]
pub struct PostView {
    pub user_id: u64,               // ID of the user
    pub post_id: u64,               // ID of the post that was viewed
    pub viewed_at: u64,             // Timestamp when post was viewed
}

// Implementing Storable trait for Post
impl Storable for Post {
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
        Post {
            id: 0,
            group_id: 0,
            author_id: 0,
            content: String::new(),
            media_urls: Vec::new(),
            created_at: 0,
            updated_at: None,
            likes: Vec::new(),
            dislikes: Vec::new(),
            comment_count: 0,
        }
    }

    const BOUND: Bound = Bound::Unbounded;
}

// Implementing Storable trait for Comment
impl Storable for Comment {
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
        Comment {
            id: 0,
            post_id: 0,
            author_id: 0,
            content: String::new(),
            parent_comment_id: None,
            created_at: 0,
            updated_at: None,
            likes: Vec::new(),
        }
    }

    const BOUND: Bound = Bound::Unbounded;
}

// Implementing Storable trait for PostView
impl Storable for PostView {
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
        PostView {
            user_id: 0,
            post_id: 0,
            viewed_at: 0,
        }
    }

    const BOUND: Bound = Bound::Unbounded;
}

// Thread-local storage for managing post canister state
thread_local! {
    // Memory manager for handling stable storage
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    // Stable BTree map for storing posts
    static POSTS: RefCell<StableBTreeMap<u64, Post, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(10))), // Memory ID 10 for Posts
        )
    );

    // Stable BTree map for storing comments
    static COMMENTS: RefCell<StableBTreeMap<u64, Comment, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(11))), // Memory ID 11 for Comments
        )
    );

    // Stable BTree map for storing post views (user_id + post_id as key)
    static POST_VIEWS: RefCell<StableBTreeMap<String, PostView, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(12))), // Memory ID 12 for Post Views
        )
    );

    // Counters for generating unique IDs
    static NEXT_POST_ID: RefCell<u64> = RefCell::new(1);
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

// Create a new post in a group
#[update]
pub fn create_post(group_id: u64, content: String, media_urls: Vec<String>) -> Result<u64, String> {
    let author_id = get_caller_user_id()?;
    
    // Generate new post ID
    let post_id = NEXT_POST_ID.with(|id| {
        let mut next_id = id.borrow_mut();
        let current_id = *next_id;
        *next_id += 1;
        current_id
    });

    // Create new post
    let post = Post {
        id: post_id,
        group_id,
        author_id,
        content,
        media_urls,
        created_at: current_timestamp(),
        updated_at: None,
        likes: Vec::new(),
        dislikes: Vec::new(),
        comment_count: 0,
    };

    // Store the post
    POSTS.with(|posts| {
        posts.borrow_mut().insert(post_id, post);
    });

    Ok(post_id)
}

// Delete a post (only by the author)
#[update]
pub fn delete_post(post_id: u64) -> Result<(), String> {
    let caller_user_id = get_caller_user_id()?;

    // Get the post to check ownership
    let post = POSTS.with(|posts| {
        posts.borrow().get(&post_id)
    });

    match post {
        Some(post) => {
            if post.author_id != caller_user_id {
                return Err("Only the post author can delete this post".to_string());
            }
            
            // Remove the post
            POSTS.with(|posts| {
                posts.borrow_mut().remove(&post_id);
            });
            
            // TODO: Also remove all comments associated with this post
            
            Ok(())
        }
        None => Err("Post not found".to_string()),
    }
}

// Edit a post (only by the author)
#[update]
pub fn edit_post(post_id: u64, new_content: String) -> Result<(), String> {
    let caller_user_id = get_caller_user_id()?;

    // Get the post to check ownership
    let post = POSTS.with(|posts| {
        posts.borrow().get(&post_id)
    });

    match post {
        Some(mut post) => {
            if post.author_id != caller_user_id {
                return Err("Only the post author can edit this post".to_string());
            }
            
            // Update the post content
            post.content = new_content;
            post.updated_at = Some(current_timestamp());
            
            // Store the updated post
            POSTS.with(|posts| {
                posts.borrow_mut().insert(post_id, post);
            });
            
            Ok(())
        }
        None => Err("Post not found".to_string()),
    }
}

// Get all posts for a specific group
#[query]
pub fn get_posts(group_id: u64) -> Vec<Post> {
    POSTS.with(|posts| {
        let mut result = Vec::new();
        for entry in posts.borrow().iter() {
            let post = entry.value();
            if post.group_id == group_id {
                result.push(post);
            }
        }
        result
    })
}

// Get unseen posts for a user
#[query]
pub fn get_unseen_posts(user_id: u64) -> Vec<Post> {
    // Get all viewed post IDs for this user
    let viewed_post_ids: std::collections::HashSet<u64> = POST_VIEWS.with(|views| {
        let mut result = std::collections::HashSet::new();
        for entry in views.borrow().iter() {
            let view = entry.value();
            if view.user_id == user_id {
                result.insert(view.post_id);
            }
        }
        result
    });

    // Return posts that are not in the viewed set
    POSTS.with(|posts| {
        let mut result = Vec::new();
        for entry in posts.borrow().iter() {
            let post = entry.value();
            if !viewed_post_ids.contains(&post.id) {
                result.push(post);
            }
        }
        result
    })
}

// Mark a post as seen by a user
#[update]
pub fn seen_post(user_id: u64, post_id: u64) -> Result<(), String> {
    // Check if post exists
    let post_exists = POSTS.with(|posts| {
        posts.borrow().contains_key(&post_id)
    });

    if !post_exists {
        return Err("Post not found".to_string());
    }

    // Create view record
    let view_key = format!("{}_{}", user_id, post_id);
    let view = PostView {
        user_id,
        post_id,
        viewed_at: current_timestamp(),
    };

    // Store the view record
    POST_VIEWS.with(|views| {
        views.borrow_mut().insert(view_key, view);
    });

    Ok(())
}

// Like a post
#[update]
pub fn like_post(post_id: u64, user_id: u64) -> Result<(), String> {
    POSTS.with(|posts| {
        let mut posts_map = posts.borrow_mut();
        match posts_map.get(&post_id) {
            Some(mut post) => {
                // Remove from dislikes if present
                post.dislikes.retain(|&id| id != user_id);
                
                // Add to likes if not already present
                if !post.likes.contains(&user_id) {
                    post.likes.push(user_id);
                }
                
                posts_map.insert(post_id, post);
                Ok(())
            }
            None => Err("Post not found".to_string()),
        }
    })
}

// Dislike a post
#[update]
pub fn dislike_post(post_id: u64, user_id: u64) -> Result<(), String> {
    POSTS.with(|posts| {
        let mut posts_map = posts.borrow_mut();
        match posts_map.get(&post_id) {
            Some(mut post) => {
                // Remove from likes if present
                post.likes.retain(|&id| id != user_id);
                
                // Add to dislikes if not already present
                if !post.dislikes.contains(&user_id) {
                    post.dislikes.push(user_id);
                }
                
                posts_map.insert(post_id, post);
                Ok(())
            }
            None => Err("Post not found".to_string()),
        }
    })
}

// Comment on a post
#[update]
pub fn comment_on_post(post_id: u64, content: String, parent_comment_id: Option<u64>) -> Result<Comment, String> {
    let author_id = get_caller_user_id()?;

    // Check if post exists
    let post_exists = POSTS.with(|posts| {
        posts.borrow().contains_key(&post_id)
    });

    if !post_exists {
        return Err("Post not found".to_string());
    }

    // If parent_comment_id is provided, check if it exists
    if let Some(parent_id) = parent_comment_id {
        let parent_exists = COMMENTS.with(|comments| {
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
    let comment = Comment {
        id: comment_id,
        post_id,
        author_id,
        content,
        parent_comment_id,
        created_at: current_timestamp(),
        updated_at: None,
        likes: Vec::new(),
    };

    // Store the comment
    COMMENTS.with(|comments| {
        comments.borrow_mut().insert(comment_id, comment.clone());
    });

    // Increment comment count on the post
    POSTS.with(|posts| {
        let mut posts_map = posts.borrow_mut();
        if let Some(mut post) = posts_map.get(&post_id) {
            post.comment_count += 1;
            posts_map.insert(post_id, post);
        }
    });

    Ok(comment)
}

// Delete a comment (only by the author)
#[update]
pub fn delete_comment(comment_id: u64) -> Result<(), String> {
    let caller_user_id = get_caller_user_id()?;

    // Get the comment to check ownership
    let comment = COMMENTS.with(|comments| {
        comments.borrow().get(&comment_id)
    });

    match comment {
        Some(comment) => {
            if comment.author_id != caller_user_id {
                return Err("Only the comment author can delete this comment".to_string());
            }
            
            let post_id = comment.post_id;
            
            // Remove the comment
            COMMENTS.with(|comments| {
                comments.borrow_mut().remove(&comment_id);
            });
            
            // Decrement comment count on the post
            POSTS.with(|posts| {
                let mut posts_map = posts.borrow_mut();
                if let Some(mut post) = posts_map.get(&post_id) {
                    if post.comment_count > 0 {
                        post.comment_count -= 1;
                    }
                    posts_map.insert(post_id, post);
                }
            });
            
            Ok(())
        }
        None => Err("Comment not found".to_string()),
    }
}

// Edit a comment (only by the author)
#[update]
pub fn edit_comment(comment_id: u64, new_content: String) -> Result<(), String> {
    let caller_user_id = get_caller_user_id()?;

    // Get the comment to check ownership
    let comment = COMMENTS.with(|comments| {
        comments.borrow().get(&comment_id)
    });

    match comment {
        Some(mut comment) => {
            if comment.author_id != caller_user_id {
                return Err("Only the comment author can edit this comment".to_string());
            }
            
            // Update the comment content
            comment.content = new_content;
            comment.updated_at = Some(current_timestamp());
            
            // Store the updated comment
            COMMENTS.with(|comments| {
                comments.borrow_mut().insert(comment_id, comment);
            });
            
            Ok(())
        }
        None => Err("Comment not found".to_string()),
    }
}

// Get all comments for a specific post
#[query]
pub fn get_post_comments(post_id: u64) -> Vec<Comment> {
    COMMENTS.with(|comments| {
        let mut result = Vec::new();
        for entry in comments.borrow().iter() {
            let comment = entry.value();
            if comment.post_id == post_id {
                result.push(comment);
            }
        }
        result
    })
}
