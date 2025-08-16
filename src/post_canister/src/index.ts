import {
  Canister,
  query,
  update,
  ic,
  text,
  nat64,
  Vec,
  Record,
} from "azle/experimental";
import {
  createPost,
  deletePost,
  editPost,
  getPosts,
  getUnseenPosts,
  likePost,
  getFilteredPosts,
  getUserCreatedPosts,
  getPostById,
  getTotalPostsCount,
} from "./services/post_service";
import {
  createComment,
  deleteComment,
  editComment,
  getCommentsByPost,
  getCommentById,
  likeComment,
  getCommentReplies,
  getTotalCommentsForPost,
} from "./services/comment_service";

// Simple response type
const SimpleResponse = Record({
  success: text,
  data: text,
  error: text,
});

export default Canister({
  // Post management functions
  createPost: update([text], text, (request) => {
    try {
      const parsedRequest = JSON.parse(request);
      const result = createPost(parsedRequest);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify({ success: false, error: `${error}` });
    }
  }),

  deletePost: update([nat64], text, (postId) => {
    try {
      const result = deletePost(postId);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify({ success: false, error: `${error}` });
    }
  }),

  editPost: update([nat64, text], text, (postId, newContent) => {
    try {
      const result = editPost(postId, newContent);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify({ success: false, error: `${error}` });
    }
  }),

  getPostById: query([nat64], text, (postId) => {
    try {
      const result = getPostById(postId);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify({ success: false, error: `${error}` });
    }
  }),

  getPosts: query([nat64], text, (groupId) => {
    try {
      const result = getPosts(groupId);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify([]);
    }
  }),

  getUnseenPosts: query([text], text, (userId) => {
    try {
      const result = getUnseenPosts(userId);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify([]);
    }
  }),

  getFilteredPosts: query([text], text, (filterJson) => {
    try {
      const filter = JSON.parse(filterJson);
      const result = getFilteredPosts(filter);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify([]);
    }
  }),

  getUserCreatedPosts: query([text], text, (userId) => {
    try {
      const result = getUserCreatedPosts(userId);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify([]);
    }
  }),

  likePost: update([nat64, text], text, (postId, userId) => {
    try {
      const result = likePost(postId, userId);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify({ success: false, error: `${error}` });
    }
  }),

  getTotalPostsCount: query([], nat64, () => {
    try {
      return getTotalPostsCount();
    } catch (error) {
      return 0n;
    }
  }),

  // Comment management functions
  createComment: update(
    [nat64, text, nat64],
    text,
    (postId, content, parentCommentId) => {
      try {
        const result = createComment(postId, content, parentCommentId);
        return JSON.stringify(result);
      } catch (error) {
        return JSON.stringify({ success: false, error: `${error}` });
      }
    }
  ),

  deleteComment: update([nat64], text, (commentId) => {
    try {
      const result = deleteComment(commentId);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify({ success: false, error: `${error}` });
    }
  }),

  editComment: update([nat64, text], text, (commentId, newContent) => {
    try {
      const result = editComment(commentId, newContent);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify({ success: false, error: `${error}` });
    }
  }),

  getCommentById: query([nat64], text, (commentId) => {
    try {
      const result = getCommentById(commentId);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify({ success: false, error: `${error}` });
    }
  }),

  getCommentsByPost: query([nat64], text, (postId) => {
    try {
      const result = getCommentsByPost(postId);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify([]);
    }
  }),

  getCommentReplies: query([nat64], text, (commentId) => {
    try {
      const result = getCommentReplies(commentId);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify([]);
    }
  }),

  likeComment: update([nat64, text], text, (commentId, userId) => {
    try {
      const result = likeComment(commentId, userId);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify({ success: false, error: `${error}` });
    }
  }),

  getTotalCommentsForPost: query([nat64], nat64, (postId) => {
    try {
      return getTotalCommentsForPost(postId);
    } catch (error) {
      return 0n;
    }
  }),

  // Health check
  healthCheck: query([], text, () => {
    return "Post canister is running";
  }),

  // Get current caller
  whoami: query([], text, () => {
    return ic.caller().toString();
  }),
});
