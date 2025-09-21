use crate::storage::USERS;
use crate::types::sport::Sports;
use crate::types::user::PublicUser;
use crate::types::{
    activity::UserActivity,
    city::CityData,
    error::Error,
    governorate::GovernorateData,
    notification::{NewNotification, Notification},
    user::{RegisteringUser, UpdatingUser, User, UserRole},
};
use base64::Engine;
use candid::{Nat, Principal};
use ic_cdk::api::time;
use ic_cdk::management_canister::raw_rand;
use icrc_ledger_types::icrc1::account::Account;
use icrc_ledger_types::icrc2::transfer_from::{TransferFromArgs, TransferFromError};

impl User {
    pub async fn give_welcome_bonus(user_principal: Principal) -> Result<u64, String> {
        // ICRC1 Ledger canister ID
        const LEDGER_CANISTER_ID: &str = "u6s2n-gx777-77774-qaaba-cai";

        // Token amount to give new users (100 tokens)
        const WELCOME_BONUS: u64 = 100_000;

        // Treasury account that has the tokens
        const TREASURY_ACCOUNT: &str =
            "a2ttl-swgqe-2gnnl-skcbm-k76uz-5wufo-omrk2-2mgsk-sxs4q-n6usf-dqe";

        let treasury_principal = Principal::from_text(TREASURY_ACCOUNT)
            .map_err(|e| format!("Invalid treasury account: {}", e))?;

        let transfer_args = TransferFromArgs {
            spender_subaccount: None,
            from: Account {
                owner: treasury_principal,
                subaccount: None,
            },
            to: Account {
                owner: user_principal,
                subaccount: None,
            },
            amount: WELCOME_BONUS.into(),
            fee: None,
            memo: Some(b"Welcome bonus".to_vec().into()),
            created_at_time: None,
        };

        let ledger_principal = Principal::from_text(LEDGER_CANISTER_ID)
            .map_err(|e| format!("Invalid ledger canister ID: {}", e))?;

        // Use icrc2_transfer_from to transfer tokens from treasury to user
        match ic_cdk::call::<(TransferFromArgs,), (Result<Nat, TransferFromError>,)>(
            ledger_principal,
            "icrc2_transfer_from",
            (transfer_args,),
        )
        .await
        {
            Ok((Ok(block_index),)) => {
                // Convert Nat to u64 for the return value
                let block_num = block_index.0.to_u64_digits();
                if block_num.len() > 0 {
                    Ok(block_num[0])
                } else {
                    Ok(0)
                }
            },
            Ok((Err(transfer_error),)) => Err(format!("Transfer failed: {:?}", transfer_error)),
            Err((rejection_code, msg)) => {
                Err(format!("Call failed: {:?}, {}", rejection_code, msg))
            }
        }
    }
    pub fn new(registering_user: RegisteringUser) -> Result<Self, Error> {
        let principal_id = ic_cdk::api::msg_caller();
        if Self::get_user(principal_id).is_ok() {
            return Err(Error {
                code: 409,
                error: "User already exists".to_string(),
                message: "A user with this principal ID already exists".to_string(),
            });
        }

        // validate data
        if registering_user.username.trim().is_empty() {
            return Err(Error {
                code: 400,
                error: "Username is required".to_string(),
                message: "Username cannot be empty".to_string(),
            });
        }
        if registering_user.governorate == 0 {
            return Err(Error {
                code: 400,
                error: "Governorate is required".to_string(),
                message: "You must select your governorate".to_string(),
            });
        }
        if registering_user.city == 0 {
            return Err(Error {
                code: 400,
                error: "City is required".to_string(),
                message: "You must select your city".to_string(),
            });
        }

        if registering_user.sports.is_empty() {
            return Err(Error {
                code: 400,
                error: "Sports are required".to_string(),
                message: "You must select at least one sport".to_string(),
            });
        }

        let created_at = ic_cdk::api::time();
        let governorate =
            GovernorateData::get_by_id(registering_user.governorate).map_err(|e| e)?;
        let city = CityData::get_by_id(registering_user.city, registering_user.governorate)
            .map_err(|e| e)?;

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

        // Give welcome bonus asynchronously (ignore result here, log if needed)
        let _ = ic_cdk::spawn(async move {
            match Self::give_welcome_bonus(principal_id).await {
                Ok(amount) => ic_cdk::api::debug_print(format!(
                    "Welcome bonus of {} tokens given to {}",
                    amount, principal_id
                )),
                Err(e) => ic_cdk::api::debug_print(format!(
                    "Failed to give welcome bonus to {}: {}",
                    principal_id, e
                )),
            }
        });

        USERS.with(|users| {
            users.borrow_mut().insert(principal_id, new_user.clone());
            Ok(new_user)
        })
    }

    pub fn get_user(principal_id: Principal) -> Result<Self, Error> {
        USERS.with(|users| {
            let mut user = users.borrow().get(&principal_id);

            if let Some(user) = &mut user {
                // check if user is online with the last active timestamp
                user.is_online();

                Ok(user.clone())
            } else {
                Err(Error {
                    code: 404,
                    error: "User not found".to_string(),
                    message: "No user exists with the given principal ID".to_string(),
                })
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

    pub fn update(&mut self, updating_user: UpdatingUser) -> Result<(), Error> {
        if let Some(username) = updating_user.username {
            self.username = username;
        }
        if let Some(governorate) = updating_user.governorate {
            self.governorate = GovernorateData::get_by_id(governorate).map_err(|e| e)?;
        }
        if let Some(city) = updating_user.city {
            self.city = CityData::get_by_id(city, self.governorate.id).map_err(|e| e)?;
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

    pub fn delete(&self) -> Result<(), Error> {
        USERS.with(|users| {
            users.borrow_mut().remove(&self.principal_id);
        });
        Ok(())
    }

    pub fn set_status(&mut self, is_online: bool) -> Result<(), Error> {
        self.is_online = is_online;
        self.manual_status = !is_online;
        USERS.with(|users| {
            users.borrow_mut().insert(self.principal_id, self.clone());
        });
        Ok(())
    }

    pub async fn add_notification(&mut self, notification: NewNotification) -> Result<(), Error> {
        self.notifications.push(Notification {
            content: notification.content,
            created_at: time(),
            is_read: false,
            notification_type: notification.notification_type,
            id: raw_rand()
                .await
                .map_err(|e| Error {
                    code: 500,
                    error: e.to_string(),
                    message: "Internal Server Error".to_string(),
                })
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

    pub fn mark_notification_as_read(&mut self, notification_id: String) -> Result<(), Error> {
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
            Err(Error {
                code: 404,
                error: "Notification not found".to_string(),
                message: "No notification exists with the given ID".to_string(),
            })
        }
    }

    pub fn ping(&mut self) -> Result<(), Error> {
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

    pub fn add_activity(&mut self, activity: UserActivity) -> Result<(), Error> {
        // data validation
        if activity.duration == 0 {
            return Err(Error {
                code: 422,
                error: "Invalid activity duration".to_string(),
                message: "Duration must be greater than zero".to_string(),
            });
        }

        if activity.time == 0 {
            return Err(Error {
                code: 422,
                error: "Invalid activity start time".to_string(),
                message: "Start time must be greater than zero".to_string(),
            });
        }

        if activity.time > time() {
            return Err(Error {
                code: 422,
                error: "Invalid activity start time".to_string(),
                message: "Start time cannot be in the future".to_string(),
            });
        }

        if activity.sport == Sports::Running || activity.sport == Sports::Cycling {
            if let Some(distance) = activity.distance {
                if distance == 0.0 {
                    return Err(Error {
                        code: 422,
                        error: "Invalid activity distance".to_string(),
                        message: "Distance must be greater than zero".to_string(),
                    });
                }
            } else {
                return Err(Error {
                    code: 422,
                    error: "Invalid activity distance".to_string(),
                    message: "Distance is required for running and cycling".to_string(),
                });
            }
        }

        self.activity.push(activity);
        USERS.with(|users| {
            users.borrow_mut().insert(self.principal_id, self.clone());
        });
        Ok(())
    }
}
