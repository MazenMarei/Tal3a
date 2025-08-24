use candid::Principal;

use crate::{
    storage::{LIKES_BY_POST, LIKES_BY_USER, POSTS},
    types::{
        likes::{Like, LikeTarget, Likes},
        posts::Post,
    },
};

impl Like {
    pub fn new(like: Self) -> Result<(), String> {
        // * check the type of the like
        match like.clone().target {
            LikeTarget::Post(post_id) => {
                // * check if the post exists
                let post = Post::get_by_id(&post_id.clone());
                if post.is_err() {
                    return Err("cannot like unknown post".into());
                }

                LIKES_BY_POST.with(|posts_list| {
                    let post_likes = posts_list.borrow_mut().get(&post_id);
                    // * initialize the post likes vector if it doesn't exist
                    if post_likes.is_none() {
                        posts_list
                            .borrow_mut()
                            .insert(post_id.clone(), Likes { likes: vec![] });
                    }

                    let mut post_likes = post_likes.unwrap();
                    // * user already liked the post
                    if post_likes.likes.iter().any(|l| l.user_id == like.user_id) {
                        return Err("User already liked this post".to_string());
                    }

                    // * add the like to the post likes vector
                    post_likes.likes.push(like.clone());
                    posts_list.borrow_mut().insert(post_id.clone(), post_likes);
                    Ok(())
                })?;

                // * update the user likes
                LIKES_BY_USER.with(|user_likes| {
                    let user_likes_vec = user_likes.borrow_mut().get(&like.user_id);
                    // * initialize the user likes vector if it doesn't exist
                    if user_likes_vec.is_none() {
                        user_likes
                            .borrow_mut()
                            .insert(like.user_id, Likes { likes: vec![] });
                    }

                    let mut user_likes_vec = user_likes_vec.unwrap();
                    // * check if the user already liked the post
                    if user_likes_vec.likes.iter().any(|l| l.target == like.target) {
                        return;
                    }

                    // * add the like to the user likes vector
                    user_likes_vec.likes.push(like.clone());
                    user_likes.borrow_mut().insert(like.user_id, user_likes_vec);
                });

                // * update post likes counter
                POSTS.with(|posts| {
                    let mut post = posts.borrow_mut().get(&post_id.clone()).unwrap();
                    post.likes += 1;
                    posts.borrow_mut().insert(post_id.clone(), post);
                });

                Ok(())
            }

            LikeTarget::Comment(comment_id) => {
                // * check if the comment exists
                Ok(())
            }
        }
    }

    pub fn delete(like: LikeTarget, user_id: Principal) -> Result<(), String> {
        match like.clone() {
            LikeTarget::Post(post_id) => {
                // * check if the post exists
                let post = Post::get_by_id(&post_id.clone());
                if post.is_err() {
                    return Err("cannot unlike unknown post".to_string());
                }

                LIKES_BY_POST.with(|posts_list| {
                    let post_likes = posts_list.borrow_mut().get(&post_id);
                    // * post likes vector doesn't exist
                    if post_likes.is_none() {
                        return;
                    }

                    let mut post_likes = post_likes.unwrap();
                    // * user hasn't liked the post
                    if !post_likes.likes.iter().any(|l| l.user_id == user_id) {
                        return;
                    }

                    // * remove the like from the post likes vector
                    post_likes.likes.retain(|l| l.user_id != user_id);
                    posts_list.borrow_mut().insert(post_id.clone(), post_likes);
                });

                // * update the user likes
                LIKES_BY_USER.with(|user_likes| {
                    let user_likes_vec = user_likes.borrow_mut().get(&user_id);
                    // * user likes vector doesn't exist
                    if user_likes_vec.is_none() {
                        return;
                    }

                    let mut user_likes_vec = user_likes_vec.unwrap();
                    // * user hasn't liked the post
                    if !user_likes_vec.likes.iter().any(|l| l.target == like) {
                        return;
                    }

                    // * remove the like from the user likes vector
                    user_likes_vec.likes.retain(|l| l.target != like);
                    user_likes.borrow_mut().insert(user_id, user_likes_vec);
                });

                // * update post likes counter
                POSTS.with(|posts| {
                    let mut post = posts.borrow_mut().get(&post_id.clone()).unwrap();
                    post.likes -= 1;
                    posts.borrow_mut().insert(post_id.clone(), post);
                });

                Ok(())
            }

            LikeTarget::Comment(comment_id) => {
                // * check if the comment exists
                Ok(())
            }
        }
    }
}
