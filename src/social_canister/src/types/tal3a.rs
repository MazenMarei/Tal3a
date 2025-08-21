use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

// * Tal3a status enum
#[derive(Debug, Clone, Deserialize, Serialize, CandidType, PartialEq)]
pub enum Tal3aStatus {
    Upcoming,    // قادم
    InProgress,  // جاري
    Completed,   // مكتمل
    Cancelled,   // ملغي
}

// * Tal3a struct for creating new Tal3a events
#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]
pub struct Tal3a {
    pub id: u64,
    pub group_id: u64,
    pub creator_id: Principal,
    pub title: String,
    pub description: Option<String>,
    pub tal3a_date: u64,          // timestamp
    pub duration_hours: u8,       // مدة الطلعة بالساعات
    pub location: String,         // مكان الطلعة
    pub max_participants: Option<u16>, // أقصى عدد مشاركين
    pub participants: Vec<Principal>,   // المشاركين
    pub status: Tal3aStatus,
    pub images: Vec<Vec<u8>>,     // صور الطلعة
    pub cost_per_person: Option<u64>,   // التكلفة للشخص الواحد
    pub requirements: Vec<String>, // متطلبات الطلعة
    pub created_at: u64,
    pub updated_at: u64,
}

// * Tal3aUpdate struct for updating Tal3a data
#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]
pub struct Tal3aUpdate {
    pub title: Option<String>,
    pub description: Option<String>,
    pub tal3a_date: Option<u64>,
    pub duration_hours: Option<u8>,
    pub location: Option<String>,
    pub max_participants: Option<u16>,
    pub status: Option<Tal3aStatus>,
    pub images: Option<Vec<Vec<u8>>>,
    pub cost_per_person: Option<u64>,
    pub requirements: Option<Vec<String>>,
}

// * Review struct for Tal3a reviews
#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]
pub struct Review {
    pub id: u64,
    pub tal3a_id: u64,
    pub user_id: Principal,
    pub rating: u8,           // من 1 إلى 5
    pub comment: Option<String>,
    pub created_at: u64,
}

// * Comment struct for Tal3a comments
#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]
pub struct Comment {
    pub id: u64,
    pub tal3a_id: u64,
    pub user_id: Principal,
    pub content: String,
    pub parent_comment_id: Option<u64>,
    pub created_at: u64,
}
