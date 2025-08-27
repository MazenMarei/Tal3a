// Social Context - Manages social features (groups and posts)
import React, { createContext, useState, useEffect } from "react";
import { useAuth } from "../hooks/useCanisterHooks";
import toast from "react-hot-toast";

const SocialContext = createContext();

export const SocialProvider = ({ children }) => {
  const { actors, isAuthenticated } = useAuth();
  const [groups, setGroups] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Group operations
  const fetchFilteredGroups = async (filter = {}) => {
    if (!actors.social) return [];

    try {
      const result = await actors.social.filter_groups(filter);

      // Ensure result is an array before processing
      if (!result) {
        console.warn("fetchFilteredGroups: result is null/undefined");
        return [];
      }

      if (!Array.isArray(result)) {
        console.warn(
          "fetchFilteredGroups: result is not an array:",
          typeof result,
          result
        );
        return [];
      }

      // Validate and sanitize the data to ensure all required fields are present
      const validatedGroups = result.filter((group) => {
        // Check if required fields exist
        if (!group || typeof group !== "object") {
          console.warn("Invalid group object:", group);
          return false;
        }

        // Ensure governorate_id exists or add a default
        if (
          group.governorate_id === undefined ||
          group.governorate_id === null
        ) {
          console.warn(
            "Group missing governorate_id, adding default:",
            group.id
          );
          group.governorate_id = 0; // Default value
        }

        // Ensure other required fields
        const isValid =
          group.id &&
          group.name &&
          group.sport_type &&
          typeof group.governorate_id === "number";

        if (!isValid) {
          console.warn("Group failed validation:", {
            id: !!group.id,
            name: !!group.name,
            sport_type: !!group.sport_type,
            governorate_id: typeof group.governorate_id,
            group,
          });
        }

        return isValid;
      });

      console.log(
        `fetchFilteredGroups: ${result.length} total, ${validatedGroups.length} valid`
      );
      return validatedGroups;
    } catch (error) {
      console.error("Error fetching filtered groups:", error);
      return [];
    }
  };

  const fetchAllGroups = async () => {
    if (!actors.social) return;

    try {
      setLoading(true);
      setError(null);

      const result = await fetchFilteredGroups({});
      setGroups(result);
    } catch (error) {
      console.error("Error fetching groups:", error);
      setError(error.message);
      toast.error("Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  const getGroup = async (groupId) => {
    if (!actors.social) return null;

    try {
      const result = await actors.social.get_group(groupId);

      if (result.Ok) {
        return result.Ok;
      } else {
        console.error("Failed to fetch group:", result.Err);
        return null;
      }
    } catch (error) {
      console.error("Error fetching group:", error);
      return null;
    }
  };

  const createGroup = async (groupData) => {
    if (!actors.social) {
      toast.error("Social service not available");
      return { success: false, error: "Service unavailable" };
    }

    if (!isAuthenticated) {
      toast.error("Please login to create groups");
      return { success: false, error: "Not authenticated" };
    }

    try {
      setLoading(true);
      const result = await actors.social.create_group(groupData);

      if (result.Ok) {
        await fetchAllGroups(); // Refresh groups list
        toast.success("Group created successfully!");
        return { success: true, group: result.Ok };
      } else {
        toast.error(`Failed to create group: ${result.Err}`);
        return { success: false, error: result.Err };
      }
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Failed to create group");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteGroup = async (groupId) => {
    if (!actors.social) {
      toast.error("Social service not available");
      return { success: false, error: "Service unavailable" };
    }

    if (!isAuthenticated) {
      toast.error("Please login to delete groups");
      return { success: false, error: "Not authenticated" };
    }

    try {
      setLoading(true);
      const result = await actors.social.delete_group(groupId);

      if (result.Ok) {
        await fetchAllGroups(); // Refresh groups list
        toast.success("Group deleted successfully!");
        return { success: true };
      } else {
        toast.error(`Failed to delete group: ${result.Err}`);
        return { success: false, error: result.Err };
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      toast.error("Failed to delete group");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async (groupId) => {
    if (!actors.social) {
      toast.error("Social service not available");
      return { success: false, error: "Service unavailable" };
    }

    if (!isAuthenticated) {
      toast.error("Please login to join groups");
      return { success: false, error: "Not authenticated" };
    }

    try {
      const result = await actors.social.join_group(groupId);

      if (result.Ok) {
        await fetchAllGroups(); // Refresh groups list
        toast.success("Joined group successfully!");
        return { success: true };
      } else {
        toast.error(`Failed to join group: ${result.Err}`);
        return { success: false, error: result.Err };
      }
    } catch (error) {
      console.error("Error joining group:", error);
      toast.error("Failed to join group");
      return { success: false, error: error.message };
    }
  };

  const leaveGroup = async (groupId) => {
    if (!actors.social) {
      toast.error("Social service not available");
      return { success: false, error: "Service unavailable" };
    }

    if (!isAuthenticated) {
      toast.error("Please login to leave groups");
      return { success: false, error: "Not authenticated" };
    }

    try {
      const result = await actors.social.leave_group(groupId);

      if (result.Ok) {
        await fetchAllGroups(); // Refresh groups list
        toast.success("Left group successfully!");
        return { success: true };
      } else {
        toast.error(`Failed to leave group: ${result.Err}`);
        return { success: false, error: result.Err };
      }
    } catch (error) {
      console.error("Error leaving group:", error);
      toast.error("Failed to leave group");
      return { success: false, error: error.message };
    }
  };

  const getGroupMembers = async (groupId) => {
    if (!actors.social) return [];

    try {
      const result = await actors.social.get_group_members(groupId);
      return result;
    } catch (error) {
      console.error("Error fetching group members:", error);
      return [];
    }
  };

  const getMemberGroups = async (principalId) => {
    if (!actors.social) return [];

    try {
      const result = await actors.social.get_member_groups(principalId);
      return result;
    } catch (error) {
      console.error("Error fetching member groups:", error);
      return [];
    }
  };

  const getSubClubs = async (parentGroupId) => {
    if (!actors.social) return [];

    try {
      const result = await actors.social.get_sub_clubs(parentGroupId);
      return result;
    } catch (error) {
      console.error("Error fetching sub clubs:", error);
      return [];
    }
  };

  // Post operations
  const fetchAllPosts = async () => {
    if (!actors.social) return;

    try {
      setLoading(true);
      setError(null);

      const result = await actors.social.get_unseen_posts();
      setPosts(result);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError(error.message);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupPosts = async (groupId) => {
    if (!actors.social) return [];

    try {
      const result = await actors.social.get_group_posts(groupId);
      return result;
    } catch (error) {
      console.error("Error fetching group posts:", error);
      return [];
    }
  };

  const fetchUserPosts = async (principalId) => {
    if (!actors.social) return [];

    try {
      const result = await actors.social.get_posts_by_user(principalId);
      return result;
    } catch (error) {
      console.error("Error fetching user posts:", error);
      return [];
    }
  };

  const getCurrentUserPosts = async () => {
    if (!actors.social) return [];

    try {
      const result = await actors.social.get_current_user_posts();
      return result;
    } catch (error) {
      console.error("Error fetching current user posts:", error);
      return [];
    }
  };

  const getPost = async (postId) => {
    if (!actors.social) return null;

    try {
      const result = await actors.social.get_post(postId);

      if (result.Ok) {
        return result.Ok;
      } else {
        console.error("Failed to fetch post:", result.Err);
        return null;
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      return null;
    }
  };

  const createPost = async (postData) => {
    if (!actors.social) {
      toast.error("Social service not available");
      return { success: false, error: "Service unavailable" };
    }

    if (!isAuthenticated) {
      toast.error("Please login to create posts");
      return { success: false, error: "Not authenticated" };
    }

    try {
      setLoading(true);
      const result = await actors.social.create_post(postData);

      if (result.Ok) {
        await fetchAllPosts(); // Refresh posts list
        toast.success("Post created successfully!");
        return { success: true, post: result.Ok };
      } else {
        toast.error(`Failed to create post: ${result.Err}`);
        return { success: false, error: result.Err };
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (postId, updateData) => {
    if (!actors.social) {
      toast.error("Social service not available");
      return { success: false, error: "Service unavailable" };
    }

    if (!isAuthenticated) {
      toast.error("Please login to update posts");
      return { success: false, error: "Not authenticated" };
    }

    try {
      const result = await actors.social.update_post(postId, updateData);

      if (result.Ok) {
        await fetchAllPosts(); // Refresh posts list
        toast.success("Post updated successfully!");
        return { success: true, post: result.Ok };
      } else {
        toast.error(`Failed to update post: ${result.Err}`);
        return { success: false, error: result.Err };
      }
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post");
      return { success: false, error: error.message };
    }
  };

  const deletePost = async (postId) => {
    if (!actors.social) {
      toast.error("Social service not available");
      return { success: false, error: "Service unavailable" };
    }

    if (!isAuthenticated) {
      toast.error("Please login to delete posts");
      return { success: false, error: "Not authenticated" };
    }

    try {
      const result = await actors.social.delete_post(postId);

      if (result.Ok) {
        await fetchAllPosts(); // Refresh posts list
        toast.success("Post deleted successfully!");
        return { success: true };
      } else {
        toast.error(`Failed to delete post: ${result.Err}`);
        return { success: false, error: result.Err };
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
      return { success: false, error: error.message };
    }
  };

  // Like operations
  const likePost = async (postId) => {
    if (!actors.social) return { success: false, error: "Service unavailable" };

    if (!isAuthenticated) {
      toast.error("Please login to like posts");
      return { success: false, error: "Not authenticated" };
    }

    try {
      const result = await actors.social.like({ Post: postId });

      if (result.Ok) {
        await fetchAllPosts(); // Refresh posts list
        return { success: true };
      } else {
        toast.error(`Failed to like post: ${result.Err}`);
        return { success: false, error: result.Err };
      }
    } catch (error) {
      console.error("Error liking post:", error);
      return { success: false, error: error.message };
    }
  };

  const unlikePost = async (postId) => {
    if (!actors.social) return { success: false, error: "Service unavailable" };

    if (!isAuthenticated) {
      toast.error("Please login to unlike posts");
      return { success: false, error: "Not authenticated" };
    }

    try {
      const result = await actors.social.unlike({ Post: postId });

      if (result.Ok) {
        await fetchAllPosts(); // Refresh posts list
        return { success: true };
      } else {
        toast.error(`Failed to unlike post: ${result.Err}`);
        return { success: false, error: result.Err };
      }
    } catch (error) {
      console.error("Error unliking post:", error);
      return { success: false, error: error.message };
    }
  };

  const getPostLikes = async (postId) => {
    if (!actors.social) return [];

    try {
      const result = await actors.social.get_post_likes(postId);
      return result;
    } catch (error) {
      console.error("Error fetching post likes:", error);
      return [];
    }
  };

  const getUserLikes = async () => {
    if (!actors.social) return [];

    try {
      const result = await actors.social.get_user_likes();
      return result;
    } catch (error) {
      console.error("Error fetching user likes:", error);
      return [];
    }
  };

  const markPostAsRead = async (postId) => {
    if (!actors.social) return { success: false, error: "Service unavailable" };

    try {
      const result = await actors.social.mark_post_as_read(postId);

      if (result.Ok) {
        return { success: true };
      } else {
        return { success: false, error: result.Err };
      }
    } catch (error) {
      console.error("Error marking post as read:", error);
      return { success: false, error: error.message };
    }
  };

  // Initialize data when authenticated
  useEffect(() => {
    if (actors.social) {
      fetchAllGroups();
      fetchAllPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actors.social]);

  const value = {
    groups,
    posts,
    loading,
    error,
    // Group methods
    fetchAllGroups,
    fetchFilteredGroups,
    getGroup,
    createGroup,
    deleteGroup,
    joinGroup,
    leaveGroup,
    getGroupMembers,
    getMemberGroups,
    getSubClubs,
    // Post methods
    fetchAllPosts,
    fetchGroupPosts,
    fetchUserPosts,
    getCurrentUserPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    // Like methods
    likePost,
    unlikePost,
    getPostLikes,
    getUserLikes,
    markPostAsRead,
  };

  return (
    <SocialContext.Provider value={value}>{children}</SocialContext.Provider>
  );
};

export { SocialContext };
