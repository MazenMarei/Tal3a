use crate::types::activity::UserActivity;
use crate::types::notification::Notification;
use crate::types::{city::CityData, governorate::GovernorateData, sport::Sports};
use candid::CandidType;
use candid::Principal;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Clone, CandidType)]
pub enum UserRole {
    User,
    Admin,
}

// * User struct represents a user in the system
#[derive(CandidType, Deserialize, Serialize, Clone)]
pub struct User {
    pub principal_id: Principal,
    pub created_at: u64,
    pub username: String,
    pub governorate: GovernorateData,
    pub city: CityData,
    pub bio: Option<String>,
    pub avatar_url: Option<Vec<u8>>,
    pub sports: Vec<Sports>,
    pub role: UserRole,
    pub free_days: Option<Vec<u8>>,
    pub is_online: bool,
    pub notifications: Vec<Notification>,
    pub last_active: u64,
    pub activity: Vec<UserActivity>,
    pub manual_status: bool, // if the user set their status manually e.g. offline
}

//  * RegisteringUser struct for user registration data
#[derive(CandidType, Deserialize, Serialize, Clone)]
pub struct RegisteringUser {
    pub username: String,
    pub governorate: u8,
    pub city: u16,
    pub bio: Option<String>,
    pub avatar_url: Option<Vec<u8>>,
    pub sports: Vec<Sports>,
    pub free_days: Option<Vec<u8>>,
}

// * UpdatingUser struct for user registration data
#[derive(CandidType, Deserialize, Serialize, Clone)]
pub struct UpdatingUser {
    pub username: Option<String>,
    pub governorate: Option<u8>,
    pub city: Option<u16>,
    pub points: Option<u64>,
    pub bio: Option<String>,
    pub avatar_url: Option<Vec<u8>>,
    pub sports: Vec<Sports>,
    pub free_days: Option<Vec<u8>>,
}

// * PublicUser struct for user general information
#[derive(CandidType, Deserialize, Serialize, Clone)]
pub struct PublicUser {
    pub principal_id: Principal,
    pub created_at: u64,
    pub username: String,
    pub governorate: GovernorateData,
    pub city: CityData,
    pub bio: Option<String>,
    pub avatar_url: Option<Vec<u8>>,
    pub sports: Vec<Sports>,
    pub role: UserRole,
    pub is_online: bool,
    pub last_active: u64,
}
