use candid::CandidType;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]
pub enum NotificationType {
    Message,
    Alert,
    Reminder,
}

#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]
pub struct Notification {
    pub content: String,
    pub created_at: u64,
    pub is_read: bool,
    pub notification_type: NotificationType,
    pub id: String, // should be a UUID
}

pub struct NewNotification {
    pub content: String,
    pub notification_type: NotificationType,
}