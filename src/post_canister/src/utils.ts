import { Principal, ic } from "azle/experimental";

// Validation functions
export function validatePostContent(content: string): boolean {
  return content.trim().length > 0 && content.length <= 5000;
}

export function validateCommentContent(content: string): boolean {
  return content.trim().length > 0 && content.length <= 1000;
}

export function isPostOwner(postId: bigint, userId: Principal): boolean {
  // Simplified validation - in a real implementation this would check storage
  return true;
}

export function isCommentOwner(commentId: bigint, userId: Principal): boolean {
  // Simplified validation - in a real implementation this would check storage
  return true;
}

// Post utilities
export function hasUserSeenPost(userId: Principal, postId: bigint): boolean {
  // Simplified check - in a real implementation this would check storage
  return false;
}

export function markPostAsSeen(userId: Principal, postId: bigint): void {
  // Simplified implementation - in a real implementation this would update storage
  const seenStatus = {
    user_id: userId,
    post_id: postId,
    seen_at: ic.time(),
  };
}

export function hasUserReactedToPost(
  postId: bigint,
  userId: Principal
): boolean {
  // Simplified check - in a real implementation this would check storage
  return false;
}

export function getUserReactionOnPost(
  postId: bigint,
  userId: Principal
): string | null {
  // Simplified check - in a real implementation this would check storage
  return null;
}

export function removeUserReactionFromPost(
  postId: bigint,
  userId: Principal
): void {
  // Simplified implementation - in a real implementation this would update storage
}

export function addUserReactionToPost(
  postId: bigint,
  userId: Principal,
  reactionType: string
): void {
  // Simplified implementation - in a real implementation this would update storage
  const newReaction = {
    user_id: userId,
    reaction_type: reactionType,
    created_at: ic.time(),
  };
}

// Comment utilities
export function hasUserReactedToComment(
  commentId: bigint,
  userId: Principal
): boolean {
  // Simplified check - in a real implementation this would check storage
  return false;
}

export function addUserReactionToComment(
  commentId: bigint,
  userId: Principal,
  reactionType: string
): void {
  // Simplified implementation - in a real implementation this would update storage
  const newReaction = {
    user_id: userId,
    reaction_type: reactionType,
    created_at: ic.time(),
  };
}

// Filtering and sorting utilities
export function sortPostsByDate(
  postList: any[],
  ascending: boolean = false
): any[] {
  return postList.sort((a, b) => {
    if (ascending) {
      return Number(a.created_at - b.created_at);
    } else {
      return Number(b.created_at - a.created_at);
    }
  });
}

export function sortCommentsByDate(
  commentList: any[],
  ascending: boolean = true
): any[] {
  return commentList.sort((a, b) => {
    if (ascending) {
      return Number(a.created_at - b.created_at);
    } else {
      return Number(b.created_at - a.created_at);
    }
  });
}

// Text processing utilities
export function extractHashtags(content: string): string[] {
  const hashtagRegex = /#\w+/g;
  const matches = content.match(hashtagRegex);
  return matches ? matches.map((tag) => tag.toLowerCase()) : [];
}

export function extractMentions(content: string): string[] {
  const mentionRegex = /@\w+/g;
  const matches = content.match(mentionRegex);
  return matches
    ? matches.map((mention) => mention.substring(1).toLowerCase())
    : [];
}

// Time utilities
export function isWithinTimeRange(
  timestamp: bigint,
  startTime?: bigint,
  endTime?: bigint
): boolean {
  if (startTime && timestamp < startTime) return false;
  if (endTime && timestamp > endTime) return false;
  return true;
}

export function formatTimeAgo(timestamp: bigint): string {
  const now = Number(ic.time()) / 1000000; // Convert from nanoseconds to milliseconds
  const postTime = Number(timestamp) / 1000000;
  const diffSeconds = Math.floor((now - postTime) / 1000);

  if (diffSeconds < 60) return "now";
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} minutes ago`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} hours ago`;
  return `${Math.floor(diffSeconds / 86400)} days ago`;
}
