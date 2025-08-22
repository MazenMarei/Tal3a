use crate::storage::{StringVec, GROUPS, GROUPS_BY_USER, GROUP_MEMBERS, POSTS};
use crate::types::group::{CreatingGroup, Group, GroupFilter};
use crate::types::group_members::{GroupMember, GroupMembers};
use crate::types::notification::{NewNotification, NotificationType};
use crate::types::posts::Post;
use crate::utils::{add_notification, get_city};
use candid::Principal;
use ic_cdk::api::{msg_caller, time};
impl Group {
    pub async fn new(new_group: CreatingGroup) -> Result<Self, String> {
        // * getting the city data
        let city_data = get_city(new_group.city_id.clone(), new_group.governorate_id.clone()).await;
        if let Err(e) = city_data {
            return Err(format!("City not found: {}", e));
        }
        let city_data = city_data.unwrap();
        if let Some(parent_group_id) = new_group.parent_group_id.clone() {
            if Self::get_by_id(&parent_group_id).is_err() {
                return Err(format!(
                    "Parent group with ID {} not found",
                    parent_group_id
                ));
            }
        }

        let new_id = if let Some(_parent_group_id) = new_group.parent_group_id.clone() {
            format!(
                "{}-{}-{}-club",
                city_data.slug.to_lowercase(),
                new_group.name.clone().replace(" ", "-").to_lowercase(),
                new_group.sport_type.as_str().to_lowercase()
            )
        } else {
            format!(
                "{}-{}-group",
                city_data.slug.to_lowercase(),
                new_group.sport_type.as_str().to_lowercase()
            )
        };
        if Self::get_by_id(&new_id.clone()).is_ok() {
            return Err(format!("Group / Club already exists with ID {}", new_id));
        }

        let group_image = if let Some(img) = new_group.image {
            img
        } else {
            Vec::<u8>::new()
        };
        let new_group = Self {
            id: new_id,
            governorate_id: new_group.governorate_id,
            city_id: new_group.city_id,
            name: new_group.name,
            sport_type: new_group.sport_type,
            description: new_group.description,
            image: group_image,
            created_at: time(),
            created_by: msg_caller(),
            parent_group_id: new_group.parent_group_id,
            public: new_group.public,
        };

        GROUPS.with(|groups| {
            groups
                .borrow_mut()
                .insert(new_group.id.clone(), new_group.clone());
        });
        // * make user join group
        let _ = new_group.join(msg_caller()).await;
        Ok(new_group)
    }

    pub fn get_by_id(group_id: &str) -> Result<Self, String> {
        GROUPS.with(|groups| {
            let group = groups.borrow().get(&group_id.to_string());
            if let Some(group) = group {
                Ok(group.clone())
            } else {
                Err(format!("Group with ID {} not found", group_id))
            }
        })
    }

    pub fn filter_groups(filter: GroupFilter) -> Vec<Self> {
        GROUPS.with(|groups| {
            groups
                .borrow()
                .values()
                .filter(|group| {
                    (filter.governorate_id.is_none()
                        || filter.governorate_id == Some(group.governorate_id))
                        && (filter.city_id.is_none() || filter.city_id == Some(group.city_id))
                        && (filter.sport_type.is_none()
                            || filter.sport_type == Some(group.sport_type.clone()))
                        && group.parent_group_id.is_none()
                        && group.public
                })
                .collect()
        })
    }

    pub fn get_sub_clubs(&self) -> Vec<Self> {
        GROUPS.with(|groups| {
            groups
                .borrow()
                .values()
                .filter(|group| group.parent_group_id == Some(self.id.clone()) && group.public)
                .collect()
        })
    }

    pub fn get_sub_club(&self, club_id: &str) -> Vec<Self> {
        GROUPS.with(|groups| {
            groups
                .borrow()
                .values()
                .filter(|group| {
                    group.parent_group_id == Some(self.id.clone()) && group.id == club_id
                })
                .collect()
        })
    }

    pub fn get_members(group_id: &str) -> Vec<GroupMember> {
        GROUP_MEMBERS.with(|groups| {
            let group = groups.borrow().get(&group_id.to_string());
            if let Some(group) = group {
                group.members.clone()
            } else {
                Vec::new()
            }
        })
    }

    pub async fn join(&self, user: Principal) -> Result<(), String> {
        let group_id = self.id.clone();

        // check if parent group exists and user in it
        if self.parent_group_id.is_some() {
            let parent_group = Group::get_by_id(self.parent_group_id.as_ref().unwrap())?;
            let parent_group_members = Group::get_members(&parent_group.id);
            if !parent_group_members.iter().any(|m| m.user_id == user) {
                return Err(format!(
                    "User {} is not a member of parent group {}",
                    user, parent_group.id
                ));
            }
        }

        // Ensure group members list exists
        let group_members_exists =
            GROUP_MEMBERS.with(|group| group.borrow().get(&group_id.to_string()).is_some());
        if !group_members_exists {
            let group = Self::get_by_id(&group_id)?;
            GROUP_MEMBERS.with(|group_memb| {
                group_memb.borrow_mut().insert(
                    group.id.clone(),
                    GroupMembers {
                        members: Vec::new(),
                    },
                );
            });
        }

        // Add user to group members
        let mut already_member = false;
        let group_members_result = GROUP_MEMBERS.with(|group_memb| {
            let mut group_members_list = group_memb.borrow_mut().get(&group_id.to_string());
            if let Some(group_members) = &mut group_members_list {
                if group_members.members.iter().any(|m| m.user_id == user) {
                    already_member = true;
                    return Err(format!(
                        "User {} is already a member of group {}",
                        user, group_id
                    ));
                } else {
                    group_members.members.push(GroupMember {
                        user_id: user,
                        joined_at: time(),
                        group_id: group_id.clone(),
                    });

                    group_memb
                        .borrow_mut()
                        .insert(group_id.clone(), group_members.clone());
                }
            } else {
                return Err(format!("Cannot find members list for group {}", group_id));
            }

            // * add group ID to user's group list
            GROUPS_BY_USER.with(|user_groups| {
                let mut user_groups_borrow = user_groups.borrow_mut();
                let mut user_group_list = user_groups_borrow.get(&user);
                if let Some(user_group) = &mut user_group_list {
                    if !user_group.0.contains(&group_id) {
                        user_group.0.push(group_id.clone());
                        user_groups_borrow.insert(user, user_group.clone());
                    }
                } else {
                    user_groups_borrow.insert(
                        user,
                        StringVec {
                            0: vec![group_id.clone()],
                        },
                    );
                }
            });
            Ok(())
        });

        if let Err(e) = group_members_result {
            return Err(e);
        }
        if already_member {
            return Err(format!(
                "User {} is already a member of group {}",
                user, group_id
            ));
        }

        add_notification(
            user.clone(),
            NewNotification {
                content: format!("Welcome to {} Group / Club.,", self.name.clone()),
                notification_type: NotificationType::Message,
            },
        )
        .await?;

        Ok(())
    }

    pub fn leave(&self, user: Principal) -> Result<(), String> {
        GROUP_MEMBERS.with(|members| {
            let group_id = self.id.clone();
            let mut group = members.borrow_mut().get(&group_id);
            if let Some(group) = &mut group {
                if let Some(pos) = group.members.iter().position(|m| m.user_id == user) {
                    group.members.remove(pos);
                    members.borrow_mut().insert(group_id.clone(), group.clone());
                    // * Remove group ID from user's group list
                    GROUPS_BY_USER.with(|user_groups| {
                        let mut user_groups_borrow = user_groups.borrow_mut();
                        if let Some(mut joined_groups) = user_groups_borrow.get(&user) {
                            joined_groups.0.retain(|id| id != &self.id);
                            user_groups_borrow.insert(user, joined_groups);
                        }
                    });
                    Ok(())
                } else {
                    Err(format!(
                        "User {} is not a member of group {}",
                        user, group_id
                    ))
                }
            } else {
                Err(format!("Group with ID {} not found", group_id))
            }
        })
    }

    pub fn get_member_groups(user: Principal) -> Vec<Self> {
        GROUPS_BY_USER.with(|user_groups| {
            user_groups
                .borrow()
                .get(&user)
                .map(|groups| {
                    groups
                        .0
                        .iter()
                        .filter_map(|group_id| Self::get_by_id(group_id).ok())
                        .collect()
                })
                .unwrap_or_default()
        })
    }

    pub fn delete(&self) -> Result<(), String> {
        GROUPS.with(|groups| {
            let group_id = self.id.clone();
            let user = ic_cdk::api::msg_caller();
            if user != self.created_by {
                return Err("Only the group creator can delete the group".to_string());
            }
            let group = Group::get_by_id(&group_id).unwrap();
            // * delete sub clubs
            for sub_club in group.get_sub_clubs() {
                sub_club.delete().unwrap();
            }
            drop(group);
            if groups.borrow_mut().remove(&group_id).is_some() {
                GROUP_MEMBERS.with(|members| {
                    let group_id = self.id.clone();
                    let group_members_list = members.borrow_mut().get(&group_id);
                    if let Some(group_members) = &group_members_list {
                        for member in &group_members.members {
                            // * Remove group ID from each user's group list
                            GROUPS_BY_USER.with(|user_groups| {
                                let mut user_groups_borrow = user_groups.borrow_mut();
                                if let Some(mut joined_groups) =
                                    user_groups_borrow.get(&member.user_id)
                                {
                                    joined_groups.0.retain(|id| id != &self.id);
                                    user_groups_borrow.insert(member.user_id, joined_groups);
                                }
                            });
                        }

                        members.borrow_mut().remove(&group_id);
                    }
                });
                Ok(())
            } else {
                Err(format!("Group with ID {} not found", group_id))
            }
        })
    }

    pub fn get_posts(&self) -> Vec<Post> {
        // * check user is in group
        let is_member = GROUPS_BY_USER.with(|user_groups| {
            if let Some(groups) = user_groups.borrow().get(&msg_caller()) {
                groups.0.contains(&self.id)
            } else {
                false
            }
        });

        if !is_member {
            return Vec::new();
        }

        POSTS.with(|posts| {
            posts
                .borrow()
                .values()
                .filter(|post| post.group_id == self.id)
                .collect()
        })
    }
}
