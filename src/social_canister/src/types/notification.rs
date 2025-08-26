use candid::CandidType;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]
pub enum NotificationType {
    Message,
    Alert,
    Reminder,
}

#[derive(Debug, Clone, Deserialize, Serialize, CandidType)]

pub struct NewNotification {
    pub content: String,
    pub notification_type: NotificationType,
}