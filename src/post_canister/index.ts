import {
  Canister,
  ic,
  init,
  nat64,
  Principal,
  query,
  update,
  Vec,
  Opt,
  text,
  bool,
} from "azle/experimental";

// Import storage for initialization
import { nextPostId, nextCommentId } from "./src/storage";

export default Canister({
  // Initialize the canister
  init: init([], () => {
    nextPostId.insert("counter", 1n);
    nextCommentId.insert("counter", 1n);
  }),

  // ==================== POST MANAGEMENT ====================

  // Create a new post
  create_post: update([text], text, (postDataJson: string) => {
    try {
      const postData = JSON.parse(postDataJson);
      // Simulate creating a post
      const postId = nextPostId.get("counter") || 1n;
      nextPostId.insert("counter", postId + 1n);

      const newPost = {
        id: postId,
        ...postData,
        created_at: ic.time(),
        updated_at: ic.time(),
      };

      return JSON.stringify({ success: true, data: newPost });
    } catch (error) {
      return JSON.stringify({
        success: false,
        error: `Failed to create post: ${error}`,
      });
    }
  }),

  // Delete a post
  delete_post: update([nat64], text, (postId: bigint) => {
    try {
      // Simulate deleting a post
      return JSON.stringify({
        success: true,
        message: "Post deleted successfully",
      });
    } catch (error) {
      return JSON.stringify({
        success: false,
        error: `Failed to delete post: ${error}`,
      });
    }
  }),

  // Edit a post
  edit_post: update(
    [nat64, text],
    text,
    (postId: bigint, newContent: string) => {
      try {
        // Simulate editing a post
        return JSON.stringify({
          success: true,
          message: "Post updated successfully",
        });
      } catch (error) {
        return JSON.stringify({
          success: false,
          error: `Failed to edit post: ${error}`,
        });
      }
    }
  ),

  // Get posts in a group
  get_posts: query([nat64], Vec(text), (groupId: bigint) => {
    try {
      // Return sample posts as JSON strings
      return [
        JSON.stringify({ id: 1n, content: "Sample post 1", group_id: groupId }),
        JSON.stringify({ id: 2n, content: "Sample post 2", group_id: groupId }),
      ];
    } catch (error) {
      return [];
    }
  }),

  // Get unseen posts for a user
  get_unseen_posts: query([text], Vec(text), (userId: string) => {
    try {
      // Return sample unseen posts
      return [
        JSON.stringify({ id: 1n, content: "Unseen post 1", author_id: userId }),
        JSON.stringify({ id: 2n, content: "Unseen post 2", author_id: userId }),
      ];
    } catch (error) {
      return [];
    }
  }),

  // Mark post as seen
  seen_post: update([text, nat64], text, (userId: string, postId: bigint) => {
    try {
      // Simulate marking post as seen
      return JSON.stringify({ success: true, message: "Post marked as seen" });
    } catch (error) {
      return JSON.stringify({
        success: false,
        error: `Failed to mark post as seen: ${error}`,
      });
    }
  }),

  // Like a post
  like_post: update([nat64, text], text, (postId: bigint, userId: string) => {
    try {
      // Simulate liking a post
      return JSON.stringify({
        success: true,
        message: "Post liked successfully",
      });
    } catch (error) {
      return JSON.stringify({
        success: false,
        error: `Failed to like post: ${error}`,
      });
    }
  }),

  // Dislike a post
  dislike_post: update(
    [nat64, text],
    text,
    (postId: bigint, userId: string) => {
      try {
        // Simulate disliking a post
        return JSON.stringify({
          success: true,
          message: "Post disliked successfully",
        });
      } catch (error) {
        return JSON.stringify({
          success: false,
          error: `Failed to dislike post: ${error}`,
        });
      }
    }
  ),

  // ==================== COMMENT MANAGEMENT ====================

  // Comment on a post
  comment_on_post: update(
    [nat64, text, Opt(nat64)],
    text,
    (postId: bigint, content: string, parentCommentId: any) => {
      try {
        const commentId = nextCommentId.get("counter") || 1n;
        nextCommentId.insert("counter", commentId + 1n);

        const parentId =
          parentCommentId && parentCommentId.Some
            ? parentCommentId.Some
            : undefined;

        const newComment = {
          id: commentId,
          post_id: postId,
          content: content,
          parent_comment_id: parentId,
          created_at: ic.time(),
          updated_at: ic.time(),
        };

        return JSON.stringify({ success: true, data: newComment });
      } catch (error) {
        return JSON.stringify({
          success: false,
          error: `Failed to create comment: ${error}`,
        });
      }
    }
  ),

  // Delete a comment
  delete_comment: update([nat64], text, (commentId: bigint) => {
    try {
      return JSON.stringify({
        success: true,
        message: "Comment deleted successfully",
      });
    } catch (error) {
      return JSON.stringify({
        success: false,
        error: `Failed to delete comment: ${error}`,
      });
    }
  }),

  // Edit a comment
  edit_comment: update(
    [nat64, text],
    text,
    (commentId: bigint, newContent: string) => {
      try {
        return JSON.stringify({
          success: true,
          message: "Comment updated successfully",
        });
      } catch (error) {
        return JSON.stringify({
          success: false,
          error: `Failed to edit comment: ${error}`,
        });
      }
    }
  ),

  // ==================== QUERY FUNCTIONS ====================

  // Get post by ID
  get_post_by_id: query([nat64], text, (postId: bigint) => {
    try {
      const post = {
        id: postId,
        content: "Sample post content",
        created_at: ic.time(),
        updated_at: ic.time(),
      };
      return JSON.stringify(post);
    } catch (error) {
      return JSON.stringify({ error: "Post not found" });
    }
  }),

  // Get comments for a post
  get_post_comments: query([nat64], Vec(text), (postId: bigint) => {
    try {
      return [
        JSON.stringify({
          id: 1n,
          post_id: postId,
          content: "Sample comment 1",
        }),
        JSON.stringify({
          id: 2n,
          post_id: postId,
          content: "Sample comment 2",
        }),
      ];
    } catch (error) {
      return [];
    }
  }),

  // Get filtered posts
  get_filtered_posts: query([text], Vec(text), (filterJson: string) => {
    try {
      const filter = JSON.parse(filterJson);
      return [
        JSON.stringify({ id: 1n, content: "Filtered post 1", ...filter }),
        JSON.stringify({ id: 2n, content: "Filtered post 2", ...filter }),
      ];
    } catch (error) {
      return [];
    }
  }),

  // Get user's created posts
  get_user_posts: query([text], Vec(text), (userId: string) => {
    try {
      return [
        JSON.stringify({ id: 1n, content: "User post 1", author_id: userId }),
        JSON.stringify({ id: 2n, content: "User post 2", author_id: userId }),
      ];
    } catch (error) {
      return [];
    }
  }),

  // ==================== REACTION MANAGEMENT ====================

  // Like a comment
  like_comment: update(
    [nat64, text],
    text,
    (commentId: bigint, userId: string) => {
      try {
        return JSON.stringify({
          success: true,
          message: "Comment liked successfully",
        });
      } catch (error) {
        return JSON.stringify({
          success: false,
          error: `Failed to like comment: ${error}`,
        });
      }
    }
  ),

  // Dislike a comment
  dislike_comment: update(
    [nat64, text],
    text,
    (commentId: bigint, userId: string) => {
      try {
        return JSON.stringify({
          success: true,
          message: "Comment disliked successfully",
        });
      } catch (error) {
        return JSON.stringify({
          success: false,
          error: `Failed to dislike comment: ${error}`,
        });
      }
    }
  ),

  // ==================== SEEN STATUS MANAGEMENT ====================

  // Get seen posts for user
  get_seen_posts: query([text], Vec(text), (userId: string) => {
    try {
      return [
        JSON.stringify({ id: 1n, content: "Seen post 1", seen_by: userId }),
        JSON.stringify({ id: 2n, content: "Seen post 2", seen_by: userId }),
      ];
    } catch (error) {
      return [];
    }
  }),

  // Mark multiple posts as seen
  mark_posts_as_seen: update(
    [text, Vec(nat64)],
    text,
    (userId: string, postIds: any) => {
      try {
        const postIdsArray = Array.from(postIds);
        return JSON.stringify({
          success: true,
          message: `${postIdsArray.length} posts marked as seen`,
        });
      } catch (error) {
        return JSON.stringify({
          success: false,
          error: `Failed to mark posts as seen: ${error}`,
        });
      }
    }
  ),

  // Check if post is seen by user
  is_post_seen: query([text, nat64], bool, (userId: string, postId: bigint) => {
    try {
      // Simulate checking if post is seen
      return true;
    } catch (error) {
      return false;
    }
  }),

  // Get post seen count
  get_post_seen_count: query([nat64], nat64, (postId: bigint) => {
    try {
      // Simulate getting seen count
      return 5n;
    } catch (error) {
      return 0n;
    }
  }),

  // ==================== STATISTICS ====================

  // Get user seen statistics
  get_user_seen_stats: query([text], text, (userId: string) => {
    try {
      const stats = {
        total_seen: 10n,
        seen_today: 3n,
        last_seen_at: ic.time(),
      };
      return JSON.stringify(stats);
    } catch (error) {
      return JSON.stringify({
        total_seen: 0n,
        seen_today: 0n,
        last_seen_at: null,
      });
    }
  }),

  // Get total posts count
  get_total_posts_count: query([], nat64, () => {
    try {
      const currentId = nextPostId.get("counter") || 1n;
      return currentId - 1n;
    } catch (error) {
      return 0n;
    }
  }),

  // Get total comments count
  get_total_comments_count: query([], nat64, () => {
    try {
      const currentId = nextCommentId.get("counter") || 1n;
      return currentId - 1n;
    } catch (error) {
      return 0n;
    }
  }),

  // ==================== UTILITY FUNCTIONS ====================

  // Get caller principal
  get_caller: query([], Principal, () => {
    return ic.caller();
  }),

  // Get current time
  get_current_time: query([], nat64, () => {
    return ic.time();
  }),

  // Health check
  health_check: query([], text, () => {
    return "Post Canister is running successfully! 🚀";
  }),
});
