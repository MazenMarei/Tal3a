import { ic } from "azle/experimental";
import {
  posts,
  getNextPostId,
  addPostToUser,
  addPostToGroup,
  removePostFromUser,
  removePostFromGroup,
  getUserPosts,
  getGroupPosts,
} from "../storage";

export function createPost(request: any): any {
  try {
    const caller = ic.caller();
    const currentTime = ic.time();

    // Generate new post ID
    const postId = getNextPostId();

    // Create new post
    const newPost = {
      id: postId,
      author_id: caller.toString(),
      group_id: request.group_id,
      content: request.content,
      post_type: request.post_type,
      visibility: request.visibility,
      media_attachments: request.media_attachments || [],
      poll_data: request.poll_data,
      tags: request.tags || [],
      mentioned_users: request.mentioned_users || [],
      reactions: [],
      comments: [],
      shares_count: 0n,
      created_at: currentTime,
      updated_at: currentTime,
      is_deleted: false,
      edited: false,
      pinned: false,
      sport_related: request.sport_related,
    };

    // Store the post
    posts.insert(postId, newPost);

    // Add to user's posts
    addPostToUser(caller, postId);

    // Add to group's posts if applicable
    if (request.group_id) {
      addPostToGroup(request.group_id, postId);
    }

    return { success: true, data: newPost };
  } catch (error) {
    return { success: false, error: `Failed to create post: ${error}` };
  }
}

export function deletePost(postId: bigint): any {
  try {
    const caller = ic.caller();
    const post = posts.get(postId);

    if (!post) {
      return { success: false, error: "Post not found" };
    }

    // Check if user is the owner
    if (post.author_id !== caller.toString()) {
      return { success: false, error: "You can only delete your own posts" };
    }

    // Mark as deleted instead of removing completely
    const updatedPost = {
      ...post,
      is_deleted: true,
      content: "This post has been deleted",
      updated_at: ic.time(),
    };

    posts.insert(postId, updatedPost);

    // Remove from user's posts list
    removePostFromUser(caller, postId);

    // Remove from group's posts list if applicable
    if (post.group_id) {
      removePostFromGroup(post.group_id, postId);
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: `Failed to delete post: ${error}` };
  }
}

export function editPost(postId: bigint, newContent: string): any {
  try {
    const caller = ic.caller();
    const post = posts.get(postId);

    if (!post) {
      return { success: false, error: "Post not found" };
    }

    if (post.author_id !== caller.toString()) {
      return { success: false, error: "You can only edit your own posts" };
    }

    if (post.is_deleted) {
      return { success: false, error: "Cannot edit deleted post" };
    }

    const updatedPost = {
      ...post,
      content: newContent,
      updated_at: ic.time(),
      edited: true,
    };

    posts.insert(postId, updatedPost);

    return { success: true };
  } catch (error) {
    return { success: false, error: `Failed to edit post: ${error}` };
  }
}

export function getPosts(groupId: bigint): any[] {
  try {
    const groupPostIds = getGroupPosts(groupId);
    const groupPosts = groupPostIds
      .map((id) => posts.get(id))
      .filter((post) => post && !post.is_deleted);

    return groupPosts.sort((a, b) => Number(b.created_at - a.created_at));
  } catch (error) {
    return [];
  }
}

export function getUnseenPosts(userId: string): any[] {
  try {
    const allPosts = Array.from(posts.values())
      .filter((post) => !post.is_deleted && post.author_id !== userId)
      .sort((a, b) => Number(b.created_at - a.created_at))
      .slice(0, 50);

    return allPosts;
  } catch (error) {
    return [];
  }
}

export function likePost(postId: bigint, userId: string): any {
  try {
    const post = posts.get(postId);

    if (!post) {
      return { success: false, error: "Post not found" };
    }

    if (post.is_deleted) {
      return { success: false, error: "Cannot interact with deleted post" };
    }

    // Add like reaction
    const reactions = post.reactions || [];
    const existingReaction = reactions.find((r: any) => r.user_id === userId);

    if (existingReaction) {
      existingReaction.reaction_type = "Like";
    } else {
      reactions.push({
        user_id: userId,
        reaction_type: "Like",
        created_at: ic.time(),
      });
    }

    const updatedPost = { ...post, reactions };
    posts.insert(postId, updatedPost);

    return { success: true };
  } catch (error) {
    return { success: false, error: `Failed to like post: ${error}` };
  }
}

export function getFilteredPosts(filter: any): any[] {
  try {
    let filteredPosts = Array.from(posts.values()).filter(
      (post) => !post.is_deleted
    );

    // Filter by group
    if (filter.group_id) {
      filteredPosts = filteredPosts.filter(
        (post) => post.group_id === filter.group_id
      );
    }

    // Filter by author
    if (filter.author_id) {
      filteredPosts = filteredPosts.filter(
        (post) => post.author_id === filter.author_id
      );
    }

    // Sort by date (newest first)
    filteredPosts.sort((a, b) => Number(b.created_at - a.created_at));

    // Apply pagination
    const offset = Number(filter.offset || 0);
    const limit = Number(filter.limit || 20);

    return filteredPosts.slice(offset, offset + limit);
  } catch (error) {
    return [];
  }
}

export function getUserCreatedPosts(userId: string): any[] {
  try {
    const userPostIds = getUserPosts(userId);
    const userPosts = userPostIds
      .map((id) => posts.get(id))
      .filter((post) => post && !post.is_deleted);

    return userPosts.sort((a, b) => Number(b.created_at - a.created_at));
  } catch (error) {
    return [];
  }
}

export function getPostById(postId: bigint): any {
  try {
    const post = posts.get(postId);

    if (!post) {
      return { success: false, error: "Post not found" };
    }

    if (post.is_deleted) {
      return { success: false, error: "Post has been deleted" };
    }

    return { success: true, data: post };
  } catch (error) {
    return { success: false, error: `Failed to get post: ${error}` };
  }
}

export function getTotalPostsCount(): bigint {
  try {
    return BigInt(
      Array.from(posts.values()).filter((post) => !post.is_deleted).length
    );
  } catch (error) {
    return 0n;
  }
}
