use crate::types::activity::UserActivity;
use crate::types::error::Error;
use crate::types::notification::{NewNotification, NotificationType};
use crate::types::user::{PublicUser, RegisteringUser, UpdatingUser, User};
use candid::Principal;
use ic_cdk;
use ic_cdk::{query, update};

#[query]
fn get_user(principal_id: Principal) -> Result<PublicUser, Error> {
    let user = User::get_user(principal_id).map_err(|e| e)?;
    Ok(user.to_public())
}

#[query]
fn get_current_user() -> Result<User, Error> {
    let mut user = User::get_user(ic_cdk::api::msg_caller()).map_err(|e| e)?;
    user.is_online(); // update online status
    Ok(user)
}

#[update]
pub fn ping() -> Result<(), Error> {
    let caller = ic_cdk::api::msg_caller();
    let user = User::get_user(caller).ok();
    if let Some(mut user) = user {
        user.ping().map_err(|e| e)
    } else {
        Err(Error {
            code: 404,
            error: "User not found".to_string(),
            message: "No user exists with the given principal ID".to_string(),
        })
    }
}

#[update]
async fn create_user(new_user: RegisteringUser) -> Result<User, Error> {
    match User::new(new_user) {
        Ok(mut user) => {
            // * Welcome message notification
            user.add_notification(NewNotification {
                content: format!(
                    "Hey {} 👋,\n
            Welcome to Tal3a 🎉, your sports journey starts here!\n
            Here you’ll find people like you who love sports in your area.\n
            Get started now: Join a group, participate in an event, or create one yourself 💪⚽🚴‍♂",
                    user.username
                ),
                notification_type: NotificationType::Message,
            })
            .await
            .map_err(|e| e)?;
            Ok(user)
        }
        Err(e) => Err(e),
    }
}

#[update]
async fn add_notification(notification: NewNotification) -> Result<(), Error> {
    let caller = ic_cdk::api::msg_caller();
    let user = User::get_user(caller).ok();
    if let Some(mut user) = user {
        user.add_notification(notification)
            .await
            .map_err(|e| e)
            .map_err(|e| e)
    } else {
        Err(Error {
            code: 404,
            error: "User not found".to_string(),
            message: "No user exists with the given principal ID".to_string(),
        })
    }
}

#[update]
fn mark_notification_as_read(notification_id: String) -> Result<(), Error> {
    let caller = ic_cdk::api::msg_caller();
    let user = User::get_user(caller).ok();
    if let Some(mut user) = user {
        user.mark_notification_as_read(notification_id)
            .map_err(|e| e)
    } else {
        Err(Error {
            code: 404,
            error: "User not found".to_string(),
            message: "No user exists with the given principal ID".to_string(),
        })
    }
}

#[update]
fn update_profile(new_data: UpdatingUser) -> Result<(), Error> {
    let caller = ic_cdk::api::msg_caller();
    let user = User::get_user(caller).ok();
    if let Some(mut user) = user {
        user.update(new_data).map_err(|e| e)
    } else {
        Err(Error {
            code: 404,
            error: "User not found".to_string(),
            message: "No user exists with the given principal ID".to_string(),
        })
    }
}

#[update]
fn add_activity(activity: UserActivity) -> Result<(), Error> {
    let caller = ic_cdk::api::msg_caller();
    let user = User::get_user(caller).ok();
    if let Some(mut user) = user {
        user.add_activity(activity).map_err(|e| e)
    } else {
        Err(Error {
            code: 404,
            error: "User not found".to_string(),
            message: "No user exists with the given principal ID".to_string(),
        })
    }
}

#[update]
fn delete_account() -> Result<(), Error> {
    let caller = ic_cdk::api::msg_caller();
    let user = User::get_user(caller).ok();
    if let Some(user) = user {
        user.delete().map_err(|e| e)
    } else {
        Err(Error {
            code: 404,
            error: "User not found".to_string(),
            message: "No user exists with the given principal ID".to_string(),
        })
    }
}

#[update]
fn set_account_status(new_status: bool) -> Result<(), Error> {
    let caller = ic_cdk::api::msg_caller();
    let user = User::get_user(caller).ok();
    if let Some(mut user) = user {
        user.set_status(new_status).map_err(|e| e)
    } else {
        Err(Error {
            code: 404,
            error: "User not found".to_string(),
            message: "No user exists with the given principal ID".to_string(),
        })
    }
}
