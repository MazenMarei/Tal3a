use candid::Principal;
use ic_cdk::{api::msg_caller, futures::spawn};

use crate::{
    contracts::group,
    storage::{
        StringVec, COMMENTS_BY_POST, GROUPS, POSTS, POSTS_BY_GROUP, POSTS_BY_USER, UNSEEN_POSTS,
    },
    types::{
        notification::{NewNotification, NotificationType},
        posts::{NewPost, Post, UpdatePost},
    },
    utils::{add_notification, generate_unique_id},
};

impl Post {
    pub async fn new(post: NewPost) -> Result<Post, String> {
        // * check if the user in the group first
        let group = group::get_group_members(&post.group_id.clone());
        if !group.iter().any(|member| member.user_id == msg_caller()) {
            return Err("User is not a member of the group".into());
        }

        // * create post in primary storage
        let post_id = generate_unique_id().await;
        if post_id.is_err() {
            return Err("Failed to generate unique post ID".into());
        }
        let created_at = ic_cdk::api::time();
        let updated_at = created_at;

        let new_post = Post {
            group_id: post.group_id.clone(),
            post_id: post_id.unwrap().clone(),
            author: msg_caller(),
            content: post.content,
            images: post.images,
            created_at,
            updated_at,
            comments: 0,
            likes: 0,
        };

        POSTS.with(|posts| {
            posts
                .borrow_mut()
                .insert(new_post.post_id.clone(), new_post.clone());

            // * add post in POSTS_BY_GROUP ,  POSTS_BY_USER , COMMENTS_BY_POST for fast indexing

            POSTS_BY_GROUP.with(|posts_by_group| {
                let mut posts_by_group_list =
                    posts_by_group.borrow_mut().get(&new_post.group_id.clone());
                if let Some(post_ids) = &mut posts_by_group_list {
                    post_ids.0.push(new_post.post_id.clone());
                    posts_by_group
                        .borrow_mut()
                        .insert(new_post.group_id.clone(), post_ids.clone());
                } else {
                    // * first post in group
                    posts_by_group.borrow_mut().insert(
                        new_post.group_id.clone(),
                        StringVec {
                            0: vec![new_post.post_id.clone()],
                        },
                    );
                }
            });

            POSTS_BY_USER.with(|posts_by_user| {
                let mut user_posts = posts_by_user.borrow_mut().get(&new_post.author.clone());
                if let Some(post_ids) = &mut user_posts {
                    post_ids.0.push(new_post.post_id.clone());
                    posts_by_user
                        .borrow_mut()
                        .insert(new_post.author.clone(), post_ids.clone());
                } else {
                    // * first post by user
                    posts_by_user.borrow_mut().insert(
                        new_post.author.clone(),
                        StringVec {
                            0: vec![new_post.post_id.clone()],
                        },
                    );
                }
            });

            // * init comments storage for the post
            COMMENTS_BY_POST.with(|comments_by_post| {
                comments_by_post
                    .borrow_mut()
                    .insert(new_post.post_id.clone(), StringVec { 0: Vec::new() });
            });
        });

        // * increment group post count
        GROUPS.with(|groups| {
            let mut group = groups.borrow_mut().get(&post.group_id.clone());
            if let Some(group) = &mut group {
                group.posts += 1;
                groups
                    .borrow_mut()
                    .insert(post.group_id.clone(), group.clone());
            }
        });

        // * Schedule notification sending using a timer (truly non-blocking)
        let group_members = group.clone();
        let post_author = new_post.author;
        let post_content = new_post.content.clone();
        let group_id_clone = post.group_id.clone().to_string();
        let post_id_clone = new_post.post_id.clone();

        ic_cdk_timers::set_timer(std::time::Duration::from_nanos(1), move || {
            let post_id_for_closure = post_id_clone.clone();
            spawn(async move {
                let mut content_preview = format!("New post in group {} ", group_id_clone);

                content_preview = if post_content.len() > 50 {
                    format!("{} : {}...", content_preview, &post_content[..50])
                } else {
                    format!("{} : {}...", content_preview, post_content.clone())
                };

                for member in group_members {
                    // Don't send notification to the post author
                    if member.user_id != post_author {
                        let notification = NewNotification {
                            notification_type: NotificationType::Message,
                            content: content_preview.clone(),
                        };

                        // Send notification (ignore errors)
                        let _ = add_notification(member.user_id, notification).await;

                        // add the new post as unseen
                        UNSEEN_POSTS.with(|unseen_posts| {
                            let mut unseen_post_list =
                                unseen_posts.borrow_mut().get(&member.user_id);
                            if let Some(post_ids) = &mut unseen_post_list {
                                post_ids.0.push(post_id_for_closure.clone());
                                unseen_posts
                                    .borrow_mut()
                                    .insert(member.user_id, post_ids.clone());
                            } else {
                                // * first unseen post for the user
                                unseen_posts.borrow_mut().insert(
                                    member.user_id,
                                    StringVec {
                                        0: vec![post_id_for_closure.clone()],
                                    },
                                );
                            }
                        });
                    }
                }
                drop(content_preview);
                drop(group_id_clone);
                drop(post_content);
            });
        });

        Ok(new_post)
    }

    pub fn get_by_id(post_id: &str) -> Result<Post, String> {
        POSTS.with(|posts| {
            posts
                .borrow()
                .get(&post_id.to_string())
                .ok_or_else(|| "Post not found".to_string())
        })
    }

    pub fn delete(post_id: &str) -> Result<(), String> {
        let post = Self::get_by_id(post_id);
        if post.is_err() {
            return Err("Post not found".to_string());
        }

        let post = post.unwrap();

        if post.author != msg_caller() {
            return Err("Unauthorized, Only post author can delete the post".to_string());
        }

        POSTS.with(|posts| {
            posts.borrow_mut().remove(&post_id.to_string());
        });

        // * remove post from POSTS_BY_GROUP ,  POSTS_BY_USER , COMMENTS_BY_POST
        POSTS_BY_GROUP.with(|posts_by_group| {
            let mut posts_by_group_list = posts_by_group.borrow_mut().get(&post.group_id.clone());
            if let Some(post_ids) = &mut posts_by_group_list {
                post_ids.0.retain(|id| id != &post_id.to_string());
            }
        });

        POSTS_BY_USER.with(|posts_by_user| {
            let mut user_posts = posts_by_user.borrow_mut().get(&post.author.clone());
            if let Some(post_ids) = &mut user_posts {
                post_ids.0.retain(|id| id != &post_id.to_string());
            }
        });

        COMMENTS_BY_POST.with(|comments_by_post| {
            comments_by_post.borrow_mut().remove(&post_id.to_string());
        });

        // * decrement group post count
        GROUPS.with(|groups| {
            let mut group = groups.borrow_mut().get(&post.group_id.clone());
            if let Some(group) = &mut group {
                group.posts -= 1;
                groups
                    .borrow_mut()
                    .insert(post.group_id.clone(), group.clone());
            }
        });

        Ok(())
    }

    pub fn update(post_id: &str, updated_post: UpdatePost) -> Result<Post, String> {
        // * check if post exists
        let post = Self::get_by_id(post_id);
        if post.is_err() {
            return Err("Post not found".to_string());
        }

        let mut post = post.unwrap();

        // * check if author is the same
        if post.author != msg_caller() {
            return Err("Unauthorized, Only post author can update the post".to_string());
        }

        if updated_post.content.is_none() && updated_post.images.is_none() {
            return Err("No fields to update".to_string());
        }

        // * update post fields
        if let Some(content) = updated_post.content.clone() {
            post.content = content;
        }

        if let Some(images) = updated_post.images {
            post.images = Some(images);
        }

        post.updated_at = ic_cdk::api::time();

        POSTS.with(|posts| {
            posts.borrow_mut().insert(post_id.to_string(), post.clone());
        });

        Ok(post)
    }

    pub fn get_user_posts(user_id: Principal) -> Vec<Post> {
        POSTS_BY_USER.with(|posts_by_user| {
            if let Some(post_ids) = posts_by_user.borrow().get(&user_id) {
                post_ids
                    .0
                    .iter()
                    .filter_map(|id| Self::get_by_id(id).ok())
                    .collect()
            } else {
                Vec::new()
            }
        })
    }

    pub fn mark_as_read(&self, user_id: Principal) -> Result<(), String> {
        UNSEEN_POSTS.with(|unseen_posts| {
            let mut unseen_posts = unseen_posts.borrow_mut();
            if let Some(posts) = &mut unseen_posts.get(&user_id) {
                posts.0.retain(|post| post != &self.post_id);
                unseen_posts.insert(user_id, StringVec { 0: posts.0.clone() });
                Ok(())
            } else {
                Err("User has no unseen posts".to_string())
            }
        })
    }

    pub fn get_unseen_posts(user_id: Principal) -> Vec<Post> {
        UNSEEN_POSTS.with(|unseen_posts| {
            unseen_posts
                .borrow()
                .get(&user_id)
                .map(|posts| {
                    posts
                        .0
                        .iter()
                        .filter_map(|id| Self::get_by_id(id).ok())
                        .collect()
                })
                .unwrap_or_default()
        })
    }
}
