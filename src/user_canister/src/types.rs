use candid::CandidType;
use serde::{Deserialize, Serialize};
use candid::Principal;
use crate::utils::{get_city_name_by_id , get_governorate_name_by_id};
#[derive(CandidType, Deserialize, Serialize, Debug, Clone)]
pub struct GovernorateData {
    pub name: String,
    pub name_l1: String,
    pub slug: String,
    pub id: u8,
}

#[derive(CandidType, Deserialize, Serialize, Debug , Clone)]
pub struct CityData {
    pub name: String,
    pub name_l1: String,
    pub slug: String,
    pub id: u16,
}

// sports enum
#[derive(CandidType, Deserialize, Serialize, Clone)]
pub enum Sports {
    Football,
    Basketball,
    Tennis,
    Cycling,
    Running,
    Swimming,
    Other(String),
}

// Roles enum
#[derive(CandidType, Deserialize, Serialize, Clone)]
pub enum UserRole {
    User,
}

// User struct represents a user in the system
#[derive(CandidType, Deserialize, Serialize, Clone)]
pub struct User {
    pub principal_id: Principal,
    pub created_at: u64,
    pub username: String,
    pub government: u8,
    pub city: u16,
    pub points: u64,
    pub joined_groups: Vec<u64>,
    pub joined_tal3a: Vec<u64>,
    pub bio: Option<String>,
    pub avatar_url: Option<String>,
    pub sports: Vec<Sports>,
    pub role: UserRole,
    pub is_online: bool,
}

// PublicUser struct for public-facing user data (excluding sensitive information)
#[derive(CandidType, Deserialize, Serialize, Clone)]
pub struct PublicUser {
    pub username: String,
    pub government: GovernorateData,
    pub city: CityData,
    pub points: u64,
    pub bio: Option<String>,
    pub avatar_url: Option<String>,
    pub sports: Vec<Sports>,
}

impl User {
    // Convert User to PublicUser (excluding sensitive data)
    pub fn to_public(&self) -> PublicUser {
        PublicUser {
            username: self.username.clone(),
            government: get_governorate_name_by_id(self.government).unwrap_or(GovernorateData {
                name: String::new(),
                name_l1: String::new(),
                slug: String::new(),
                id: self.government,
            }),
            city: get_city_name_by_id(self.city, &self.government.to_string()).unwrap_or(
                CityData {
                    name: String::new(),
                    name_l1: String::new(),
                    slug: String::new(),
                    id: self.city,
                }
            ),
            points: self.points,
            bio: self.bio.clone(),
            avatar_url: self.avatar_url.clone(),
            sports: self.sports.clone(), 
        }
    }
}


