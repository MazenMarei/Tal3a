use crate::types::error::Error;
use candid::Principal;

use crate::{
    storage::{LIKES_BY_POST, LIKES_BY_USER, POSTS},
    types::{
        group::Group,
        likes::{Like, LikeTarget, Likes},
        posts::Post,
    },
};

impl Like {
    pub fn new(like: Self) -> Result<(), Error> {
        // * check the type of the like
        match like.clone().target {
            LikeTarget::Post(post_id) => {
                // * check if the post exists
                let post = Post::get_by_id(&post_id.clone());
                if post.is_err() {
                    return Err(Error {
                        code: 404,
                        error: "cannot like unknown post".into(),
                        message: "No post exists with the given ID".to_string(),
                    });
                }

                // * check if the post belongs to a group and user in this group
                let post_group = Group::get_by_id(&post.unwrap().group_id);
                if post_group.is_err() {
                    return Err(Error {
                        code: 404,
                        error: "cannot like post from unknown group".into(),
                        message: "No group exists with the given ID".to_string(),
                    });
                }

                if !post_group
                    .unwrap()
                    .get_group_members()
                    .iter()
                    .any(|m| m.user_id == like.user_id)
                {
                    return Err(Error {
                        code: 403,
                        error: "cannot like post from group you are not a member of".into(),
                        message: "User is not a member of the group".to_string(),
                    });
                }

                LIKES_BY_POST.with(|posts_list| {
                    let post_likes = posts_list.borrow_mut().get(&post_id);
                    // * initialize the post likes vector if it doesn't exist
                    if post_likes.is_none() {
                        posts_list
                            .borrow_mut()
                            .insert(post_id.clone(), Likes { likes: vec![] });
                    }

                    let mut post_likes = posts_list.borrow_mut().get(&post_id).unwrap();
                    // * user already liked the post
                    if post_likes.likes.iter().any(|l| l.user_id == like.user_id) {
                        return Err(Error {
                            code: 400,
                            error: "User already liked the post".into(),
                            message: "User has already liked the post".to_string(),
                        });
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

                    let mut user_likes_vec = user_likes.borrow_mut().get(&like.user_id).unwrap();
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

            LikeTarget::Comment(_comment_id) => {
                // * check if the comment exists
                Ok(())
            }
        }
    }

    pub fn delete(like: LikeTarget, user_id: Principal) -> Result<(), Error> {
        match like.clone() {
            LikeTarget::Post(post_id) => {
                // * check if the post exists
                let post = Post::get_by_id(&post_id.clone());
                if post.is_err() {
                    return Err(Error {
                        code: 404,
                        error: "cannot unlike unknown post".into(),
                        message: "No post exists with the given ID".to_string(),
                    });
                }

                // * check if the post belongs to a group and user in this group
                let post_group = Group::get_by_id(&post.unwrap().group_id);
                if post_group.is_err() {
                    return Err(Error {
                        code: 404,
                        error: "cannot like post from unknown group".into(),
                        message: "No group exists with the given ID".to_string(),
                    });
                }

                if !post_group
                    .unwrap()
                    .get_group_members()
                    .iter()
                    .any(|m| m.user_id == user_id)
                {
                    return Err(Error {
                        code: 403,
                        error: "cannot unlike post from group you are not a member of".into(),
                        message: "User is not a member of the group".to_string(),
                    });
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

            LikeTarget::Comment(_comment_id) => {
                // * check if the comment exists
                Ok(())
            }
        }
    }

    pub fn get_user_likes(user_id: Principal) -> Vec<Like> {
        LIKES_BY_USER.with(|user_likes| {
            let user_likes_vec = user_likes.borrow().get(&user_id);
            if let Some(user_likes_vec) = user_likes_vec {
                user_likes_vec.likes.clone()
            } else {
                vec![]
            }
        })
    }

    pub fn get_post_likes(post_id: String) -> Vec<Like> {
        LIKES_BY_POST.with(|post_likes| {
            let post_likes_vec = post_likes.borrow().get(&post_id);
            if let Some(post_likes_vec) = post_likes_vec {
                post_likes_vec.likes.clone()
            } else {
                vec![]
            }
        })
    }
}
