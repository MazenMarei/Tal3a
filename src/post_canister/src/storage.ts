import { StableBTreeMap } from "azle/experimental";

// Storage maps using simplified types
export let posts = StableBTreeMap<bigint, any>(0);
export let comments = StableBTreeMap<bigint, any>(1);
export let postSeenStatuses = StableBTreeMap<string, any>(2);
export let nextPostId = StableBTreeMap<string, bigint>(3);
export let nextCommentId = StableBTreeMap<string, bigint>(4);
export let userPosts = StableBTreeMap<string, bigint[]>(5);
export let groupPosts = StableBTreeMap<bigint, bigint[]>(6);
export let postComments = StableBTreeMap<bigint, bigint[]>(7);

// Helper functions for storage operations
export function getNextPostId(): bigint {
  const currentId = nextPostId.get("counter") || 0n;
  const newId = currentId + 1n;
  nextPostId.insert("counter", newId);
  return newId;
}

export function getNextCommentId(): bigint {
  const currentId = nextCommentId.get("counter") || 0n;
  const newId = currentId + 1n;
  nextCommentId.insert("counter", newId);
  return newId;
}

export function addPostToUser(userId: any, postId: bigint): void {
  const userKey = userId.toString();
  const userPostsArray = userPosts.get(userKey) || [];
  userPostsArray.push(postId);
  userPosts.insert(userKey, userPostsArray);
}

export function addPostToGroup(groupId: bigint, postId: bigint): void {
  const groupPostsArray = groupPosts.get(groupId) || [];
  groupPostsArray.push(postId);
  groupPosts.insert(groupId, groupPostsArray);
}

export function addCommentToPost(postId: bigint, commentId: bigint): void {
  const postCommentsArray = postComments.get(postId) || [];
  postCommentsArray.push(commentId);
  postComments.insert(postId, postCommentsArray);
}

export function removePostFromUser(userId: any, postId: bigint): void {
  const userKey = userId.toString();
  const userPostsArray = userPosts.get(userKey) || [];
  const filteredPosts = userPostsArray.filter((id: bigint) => id !== postId);
  userPosts.insert(userKey, filteredPosts);
}

export function removePostFromGroup(groupId: bigint, postId: bigint): void {
  const groupPostsArray = groupPosts.get(groupId) || [];
  const filteredPosts = groupPostsArray.filter((id: bigint) => id !== postId);
  groupPosts.insert(groupId, filteredPosts);
}

export function removeCommentFromPost(postId: bigint, commentId: bigint): void {
  const postCommentsArray = postComments.get(postId) || [];
  const filteredComments = postCommentsArray.filter(
    (id: bigint) => id !== commentId
  );
  postComments.insert(postId, filteredComments);
}

export function createSeenStatusKey(userId: any, postId: bigint): string {
  return `${userId.toString()}:${postId}`;
}

export function getUserPosts(userId: any): bigint[] {
  const userKey = userId.toString();
  return userPosts.get(userKey) || [];
}

export function getGroupPosts(groupId: bigint): bigint[] {
  return groupPosts.get(groupId) || [];
}

export function getPostComments(postId: bigint): bigint[] {
  return postComments.get(postId) || [];
}
