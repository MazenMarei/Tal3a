use crate::storage::USERS;
use crate::types::notification::Notification;
use crate::types::{
    city::CityData,
    governorate::GovernorateData,
    user::{RegisteringUser, UpdatingUser, User, UserRole},
};
use candid::Principal;

impl User {
    pub fn new(registering_user: RegisteringUser) -> Result<Self, String> {
        let principal_id = ic_cdk::api::msg_caller();
        if Self::get_user(principal_id).is_ok() {
            return Err("User already exists".to_string());
        }

        if registering_user.username.is_empty() {
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
            joined_groups: Vec::new(),
            joined_tal3a: Vec::new(),
            bio: registering_user.bio,
            avatar_url: registering_user.avatar_url,
            sports: registering_user.sports,
            role: UserRole::User,
            free_days: registering_user.free_days,
            is_online: true, // default value
            notifications: Vec::new(), // Initialize with an empty vector
        };

        USERS.with(|users| {
            users.borrow_mut().insert(principal_id, new_user.clone());
            Ok(new_user)
        })
    }

    pub fn get_user(principal_id: Principal) -> Result<Self, String> {
        USERS.with(|users| {
            let user = users.borrow().get(&principal_id);
            if let Some(user) = user {
                Ok(user.clone())
            } else {
                Err("User not found".to_string())
            }
        })
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
        let old_status = self.is_online.clone();
        self.is_online = is_online;
        USERS.with(|users| {
            users.borrow_mut().insert(self.principal_id, self.clone());
        });
        if old_status != is_online {
            Ok(())
        } else {
            Err("Status not changed".to_string())
        }
    }

    pub fn join_group(&mut self, group_id: u64) -> Result<(), String> {
        if !self.joined_groups.contains(&group_id) {
            self.joined_groups.push(group_id);
            USERS.with(|users| {
                users.borrow_mut().insert(self.principal_id, self.clone());
            });
            Ok(())
        } else {
            Err("Already a member of the group".to_string())
        }
    }

    pub fn join_tal3a(&mut self, tal3a_id: u64) -> Result<(), String> {
        if !self.joined_tal3a.contains(&tal3a_id) {
            self.joined_tal3a.push(tal3a_id);
            USERS.with(|users| {
                users.borrow_mut().insert(self.principal_id, self.clone());
            });
            Ok(())
        } else {
            Err("Already a member of the Tal3a".to_string())
        }
    }

    pub fn leave_group(&mut self, group_id: u64) -> Result<(), String> {
        if self.joined_groups.contains(&group_id) {
            self.joined_groups.retain(|&id| id != group_id);
            USERS.with(|users| {
                users.borrow_mut().insert(self.principal_id, self.clone());
            });
            Ok(())
        } else {
            Err("Not a member of the group".to_string())
        }
    }

    pub fn leave_tal3a(&mut self, tal3a_id: u64) -> Result<(), String> {
        if self.joined_tal3a.contains(&tal3a_id) {
            self.joined_tal3a.retain(|&id| id != tal3a_id);
            USERS.with(|users| {
                users.borrow_mut().insert(self.principal_id, self.clone());
            });
            Ok(())
        } else {
            Err("Not a member of the Tal3a".to_string())
        }
    }

    pub fn add_notification(&mut self, notification: Notification) {
        self.notifications.push(notification);
        USERS.with(|users| {
            users.borrow_mut().insert(self.principal_id, self.clone());
        });
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
}
