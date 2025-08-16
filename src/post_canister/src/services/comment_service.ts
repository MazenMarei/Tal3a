import { ic } from "azle/experimental";
import {
  comments,
  posts,
  getNextCommentId,
  addCommentToPost,
  removeCommentFromPost,
  getPostComments,
} from "../storage";

export function createComment(
  postId: bigint,
  content: string,
  parentCommentId?: bigint
): any {
  try {
    const caller = ic.caller();
    const currentTime = ic.time();

    // Check if post exists
    const post = posts.get(postId);
    if (!post) {
      return { success: false, error: "Post not found" };
    }

    if (post.is_deleted) {
      return { success: false, error: "Cannot comment on deleted post" };
    }

    // Validate content
    if (!content || content.trim().length === 0) {
      return { success: false, error: "Comment content cannot be empty" };
    }

    if (content.length > 500) {
      return { success: false, error: "Comment content too long" };
    }

    // Check if parent comment exists (for replies)
    if (parentCommentId) {
      const parentComment = comments.get(parentCommentId);
      if (!parentComment) {
        return { success: false, error: "Parent comment not found" };
      }
      if (parentComment.post_id !== postId) {
        return {
          success: false,
          error: "Parent comment does not belong to this post",
        };
      }
    }

    // Generate new comment ID
    const commentId = getNextCommentId();

    // Create new comment
    const newComment = {
      id: commentId,
      post_id: postId,
      author_id: caller.toString(),
      content: content.trim(),
      parent_comment_id: parentCommentId || null,
      replies: [],
      reactions: [],
      created_at: currentTime,
      updated_at: currentTime,
      is_deleted: false,
      edited: false,
    };

    // Store the comment
    comments.insert(commentId, newComment);

    // Add comment to post's comment list
    addCommentToPost(postId, commentId);

    // If this is a reply, add to parent comment's replies
    if (parentCommentId) {
      const parentComment = comments.get(parentCommentId);
      if (parentComment) {
        const updatedReplies = [...(parentComment.replies || []), commentId];
        const updatedParent = { ...parentComment, replies: updatedReplies };
        comments.insert(parentCommentId, updatedParent);
      }
    }

    return { success: true, data: newComment };
  } catch (error) {
    return { success: false, error: `Failed to create comment: ${error}` };
  }
}

export function deleteComment(commentId: bigint): any {
  try {
    const caller = ic.caller();
    const comment = comments.get(commentId);

    if (!comment) {
      return { success: false, error: "Comment not found" };
    }

    // Check if user is the owner
    if (comment.author_id !== caller.toString()) {
      return { success: false, error: "You can only delete your own comments" };
    }

    // Mark as deleted instead of removing completely
    const updatedComment = {
      ...comment,
      is_deleted: true,
      content: "This comment has been deleted",
      updated_at: ic.time(),
    };

    comments.insert(commentId, updatedComment);

    // Remove from post's comment list
    removeCommentFromPost(comment.post_id, commentId);

    // If this comment has a parent, remove from parent's replies
    if (comment.parent_comment_id) {
      const parentComment = comments.get(comment.parent_comment_id);
      if (parentComment) {
        const updatedReplies = (parentComment.replies || []).filter(
          (id: bigint) => id !== commentId
        );
        const updatedParent = { ...parentComment, replies: updatedReplies };
        comments.insert(comment.parent_comment_id, updatedParent);
      }
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: `Failed to delete comment: ${error}` };
  }
}

export function editComment(commentId: bigint, newContent: string): any {
  try {
    const caller = ic.caller();
    const comment = comments.get(commentId);

    if (!comment) {
      return { success: false, error: "Comment not found" };
    }

    if (comment.author_id !== caller.toString()) {
      return { success: false, error: "You can only edit your own comments" };
    }

    if (comment.is_deleted) {
      return { success: false, error: "Cannot edit deleted comment" };
    }

    // Validate content
    if (!newContent || newContent.trim().length === 0) {
      return { success: false, error: "Comment content cannot be empty" };
    }

    if (newContent.length > 500) {
      return { success: false, error: "Comment content too long" };
    }

    const updatedComment = {
      ...comment,
      content: newContent.trim(),
      updated_at: ic.time(),
      edited: true,
    };

    comments.insert(commentId, updatedComment);

    return { success: true };
  } catch (error) {
    return { success: false, error: `Failed to edit comment: ${error}` };
  }
}

export function getCommentsByPost(postId: bigint): any[] {
  try {
    const commentIds = getPostComments(postId);
    const postComments = commentIds
      .map((id) => comments.get(id))
      .filter((comment) => comment && !comment.is_deleted)
      .sort((a, b) => Number(a.created_at - b.created_at)); // Oldest first

    return postComments;
  } catch (error) {
    return [];
  }
}

export function getCommentById(commentId: bigint): any {
  try {
    const comment = comments.get(commentId);

    if (!comment) {
      return { success: false, error: "Comment not found" };
    }

    if (comment.is_deleted) {
      return { success: false, error: "Comment has been deleted" };
    }

    return { success: true, data: comment };
  } catch (error) {
    return { success: false, error: `Failed to get comment: ${error}` };
  }
}

export function likeComment(commentId: bigint, userId: string): any {
  try {
    const comment = comments.get(commentId);

    if (!comment) {
      return { success: false, error: "Comment not found" };
    }

    if (comment.is_deleted) {
      return { success: false, error: "Cannot interact with deleted comment" };
    }

    // Add like reaction
    const reactions = comment.reactions || [];
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

    const updatedComment = { ...comment, reactions };
    comments.insert(commentId, updatedComment);

    return { success: true };
  } catch (error) {
    return { success: false, error: `Failed to like comment: ${error}` };
  }
}

export function getCommentReplies(commentId: bigint): any[] {
  try {
    const comment = comments.get(commentId);

    if (!comment) {
      return [];
    }

    const replyIds = comment.replies || [];
    const replies = replyIds
      .map((id: bigint) => comments.get(id))
      .filter((reply: any) => reply && !reply.is_deleted)
      .sort((a: any, b: any) => Number(a.created_at - b.created_at));

    return replies;
  } catch (error) {
    return [];
  }
}

export function getTotalCommentsForPost(postId: bigint): bigint {
  try {
    const commentIds = getPostComments(postId);
    const activeComments = commentIds.filter((id) => {
      const comment = comments.get(id);
      return comment && !comment.is_deleted;
    });

    return BigInt(activeComments.length);
  } catch (error) {
    return 0n;
  }
}
