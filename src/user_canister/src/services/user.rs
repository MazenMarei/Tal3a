use crate::storage::USERS;
use crate::types::sport::Sports;
use crate::types::user::PublicUser;
use crate::types::{
    activity::UserActivity,
    city::CityData,
    governorate::GovernorateData,
    notification::{NewNotification, Notification},
    user::{RegisteringUser, UpdatingUser, User, UserRole},
};
use base64::Engine;
use candid::Principal;
use ic_cdk::api::time;
use ic_cdk::management_canister::raw_rand;

impl User {
    pub fn new(registering_user: RegisteringUser) -> Result<Self, String> {
        let principal_id = ic_cdk::api::msg_caller();
        if Self::get_user(principal_id).is_ok() {
            return Err("User already exists".to_string());
        }

        // validate data
        if registering_user.username.trim().is_empty() {
            return Err("Username is required".to_string());
        }
        if registering_user.governorate == 0 {
            return Err("Government is required".to_string());
        }
        if registering_user.city == 0 {
            return Err("City is required".to_string());
        }

        if registering_user.sports.is_empty() {
            return Err("At least one sport is required".to_string());
        }

        let created_at = ic_cdk::api::time();
        let governorate =
            GovernorateData::get_by_id(registering_user.governorate).map_err(|e| e.to_string())?;
        let city = CityData::get_by_id(registering_user.city, registering_user.governorate)
            .map_err(|e| e.to_string())?;

        let new_user = Self {
            principal_id,
            created_at,
            username: registering_user.username,
            governorate,
            city,
            bio: registering_user.bio,
            avatar_url: registering_user.avatar_url,
            sports: registering_user.sports,
            role: UserRole::User,
            free_days: registering_user.free_days,
            is_online: true,           // default value
            notifications: Vec::new(), // Initialize with an empty vector
            last_active: created_at,
            activity: Vec::new(),
            manual_status: false,
        };
        USERS.with(|users| {
            users.borrow_mut().insert(principal_id, new_user.clone());
            Ok(new_user)
        })
    }

    pub fn get_user(principal_id: Principal) -> Result<Self, String> {
        USERS.with(|users| {
            let mut user = users.borrow().get(&principal_id);

            if let Some(user) = &mut user {
                // check if user is online with the last active timestamp
                user.is_online();

                Ok(user.clone())
            } else {
                Err("User not found".to_string())
            }
        })
    }

    pub fn to_public(&self) -> PublicUser {
        PublicUser {
            principal_id: self.principal_id.clone(),
            created_at: self.created_at.clone(),
            username: self.username.clone(),
            governorate: self.governorate.clone(),
            city: self.city.clone(),
            bio: self.bio.clone(),
            avatar_url: self.avatar_url.clone(),
            sports: self.sports.clone(),
            role: self.role.clone(),
            is_online: self.is_online.clone(),
            last_active: self.last_active.clone(),
        }
    }

    pub fn update(&mut self, updating_user: UpdatingUser) -> Result<(), String> {
        if let Some(username) = updating_user.username {
            self.username = username;
        }
        if let Some(governorate) = updating_user.governorate {
            self.governorate =
                GovernorateData::get_by_id(governorate).map_err(|e| e.to_string())?;
        }
        if let Some(city) = updating_user.city {
            self.city =
                CityData::get_by_id(city, self.governorate.id).map_err(|e| e.to_string())?;
        }
        if let Some(bio) = updating_user.bio {
            self.bio = Some(bio);
        }
        if let Some(avatar_url) = updating_user.avatar_url {
            self.avatar_url = Some(avatar_url);
        }
        if !updating_user.sports.is_empty() {
            self.sports = updating_user.sports;
        }
        if let Some(free_days) = updating_user.free_days {
            self.free_days = Some(free_days);
        }

        USERS.with(|users| {
            users.borrow_mut().insert(self.principal_id, self.clone());
        });
        Ok(())
    }

    pub fn delete(&self) -> Result<(), String> {
        USERS.with(|users| {
            users.borrow_mut().remove(&self.principal_id);
        });
        Ok(())
    }

    pub fn set_status(&mut self, is_online: bool) -> Result<(), String> {
        self.is_online = is_online;
        self.manual_status = !is_online;
        USERS.with(|users| {
            users.borrow_mut().insert(self.principal_id, self.clone());
        });
        Ok(())
    }

    pub async fn add_notification(&mut self, notification: NewNotification) -> Result<(), String> {
        self.notifications.push(Notification {
            content: notification.content,
            created_at: time(),
            is_read: false,
            notification_type: notification.notification_type,
            id: raw_rand()
                .await
                .map_err(|e| format!("Random error: {:?}", e))
                .map(|bytes| {
                    // Use base64 encoding for shorter, URL-safe IDs
                    base64::engine::general_purpose::URL_SAFE_NO_PAD.encode(&bytes)
                })?,
        });
        USERS.with(|users| {
            users.borrow_mut().insert(self.principal_id, self.clone());
        });
        Ok(())
    }

    pub fn mark_notification_as_read(&mut self, notification_id: String) -> Result<(), String> {
        if let Some(notification) = self
            .notifications
            .iter_mut()
            .find(|n| n.id == notification_id)
        {
            notification.is_read = true;
            USERS.with(|users| {
                users.borrow_mut().insert(self.principal_id, self.clone());
            });
            Ok(())
        } else {
            Err("Notification not found".to_string())
        }
    }

    pub fn ping(&mut self) -> Result<(), String> {
        self.last_active = time();
        USERS.with(|users| {
            users.borrow_mut().insert(self.principal_id, self.clone());
        });
        Ok(())
    }

    pub fn is_online(&mut self) -> bool {
        const THRESHOLD: u64 = 10_000_000_000; // 120 seconds (nano seconds)
        let now = time();
        self.is_online = !self.manual_status && self.last_active + THRESHOLD > now;
        USERS.with(|users| {
            users.borrow_mut().insert(self.principal_id, self.clone());
        });
        self.is_online
    }

    pub fn add_activity(&mut self, activity: UserActivity) -> Result<(), String> {
        // data validation
        if activity.duration == 0 {
            return Err("Duration must be greater than zero".to_string());
        }

        if activity.time == 0 {
            return Err("Start time must be greater than zero".to_string());
        }

        if activity.time > time() {
            return Err("Start time cannot be in the future".to_string());
        }

        if activity.sport == Sports::Running || activity.sport == Sports::Cycling {
            if let Some(distance) = activity.distance {
                if distance == 0.0 {
                    return Err(
                        "Distance must be greater than zero for running and cycling".to_string()
                    );
                }
            } else {
                return Err("Distance is required for running and cycling".to_string());
            }
        }

        self.activity.push(activity);
        USERS.with(|users| {
            users.borrow_mut().insert(self.principal_id, self.clone());
        });
        Ok(())
    }
}
