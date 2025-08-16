import { StableBTreeMap } from "azle/experimental";

// Storage maps using simplified types
export let tal3as = StableBTreeMap<bigint, any>(0);
export let reviews = StableBTreeMap<bigint, any>(1);
export let tal3aComments = StableBTreeMap<bigint, any>(2);
export let nextTal3aId = StableBTreeMap<string, bigint>(3);
export let nextReviewId = StableBTreeMap<string, bigint>(4);
export let nextCommentId = StableBTreeMap<string, bigint>(5);

// Index maps for efficient queries
export let userOrganizedTal3as = StableBTreeMap<string, bigint[]>(6);
export let userJoinedTal3as = StableBTreeMap<string, bigint[]>(7);
export let groupTal3as = StableBTreeMap<bigint, bigint[]>(8);
export let sportTal3as = StableBTreeMap<string, bigint[]>(9);
export let cityTal3as = StableBTreeMap<number, bigint[]>(10);
export let governorateTal3as = StableBTreeMap<number, bigint[]>(11);
export let tal3aReviews = StableBTreeMap<bigint, bigint[]>(12);
export let tal3aCommentsMap = StableBTreeMap<bigint, bigint[]>(13);
export let userReviews = StableBTreeMap<string, bigint[]>(14);
export let tal3aFavorites = StableBTreeMap<string, bigint[]>(15);
export let featuredTal3as = StableBTreeMap<string, bigint[]>(16);

// Helper functions for ID generation
export function getNextTal3aId(): bigint {
  const currentId = nextTal3aId.get("counter") || 0n;
  const newId = currentId + 1n;
  nextTal3aId.insert("counter", newId);
  return newId;
}

export function getNextReviewId(): bigint {
  const currentId = nextReviewId.get("counter") || 0n;
  const newId = currentId + 1n;
  nextReviewId.insert("counter", newId);
  return newId;
}

export function getNextCommentId(): bigint {
  const currentId = nextCommentId.get("counter") || 0n;
  const newId = currentId + 1n;
  nextCommentId.insert("counter", newId);
  return newId;
}

// Helper functions for managing relationships
export function addTal3aToUser(
  userId: any,
  tal3aId: bigint,
  isOrganizer: boolean = false
): void {
  const userKey = userId.toString();

  if (isOrganizer) {
    const userOrganizedArray = userOrganizedTal3as.get(userKey) || [];
    userOrganizedArray.push(tal3aId);
    userOrganizedTal3as.insert(userKey, userOrganizedArray);
  } else {
    const userJoinedArray = userJoinedTal3as.get(userKey) || [];
    userJoinedArray.push(tal3aId);
    userJoinedTal3as.insert(userKey, userJoinedArray);
  }
}

export function removeTal3aFromUser(
  userId: any,
  tal3aId: bigint,
  isOrganizer: boolean = false
): void {
  const userKey = userId.toString();

  if (isOrganizer) {
    const userOrganizedArray = userOrganizedTal3as.get(userKey) || [];
    const filteredArray = userOrganizedArray.filter(
      (id: bigint) => id !== tal3aId
    );
    userOrganizedTal3as.insert(userKey, filteredArray);
  } else {
    const userJoinedArray = userJoinedTal3as.get(userKey) || [];
    const filteredArray = userJoinedArray.filter(
      (id: bigint) => id !== tal3aId
    );
    userJoinedTal3as.insert(userKey, filteredArray);
  }
}

export function addTal3aToGroup(groupId: bigint, tal3aId: bigint): void {
  const groupTal3asArray = groupTal3as.get(groupId) || [];
  groupTal3asArray.push(tal3aId);
  groupTal3as.insert(groupId, groupTal3asArray);
}

export function addTal3aToSport(sport: string, tal3aId: bigint): void {
  const sportTal3asArray = sportTal3as.get(sport) || [];
  sportTal3asArray.push(tal3aId);
  sportTal3as.insert(sport, sportTal3asArray);
}

export function addTal3aToLocation(
  cityId: number,
  governorateId: number,
  tal3aId: bigint
): void {
  // Add to city
  const cityTal3asArray = cityTal3as.get(cityId) || [];
  cityTal3asArray.push(tal3aId);
  cityTal3as.insert(cityId, cityTal3asArray);

  // Add to governorate
  const governorateTal3asArray = governorateTal3as.get(governorateId) || [];
  governorateTal3asArray.push(tal3aId);
  governorateTal3as.insert(governorateId, governorateTal3asArray);
}

export function addReviewToTal3a(tal3aId: bigint, reviewId: bigint): void {
  const tal3aReviewsArray = tal3aReviews.get(tal3aId) || [];
  tal3aReviewsArray.push(reviewId);
  tal3aReviews.insert(tal3aId, tal3aReviewsArray);
}

export function addCommentToTal3a(tal3aId: bigint, commentId: bigint): void {
  const tal3aCommentsArray = tal3aCommentsMap.get(tal3aId) || [];
  tal3aCommentsArray.push(commentId);
  tal3aCommentsMap.insert(tal3aId, tal3aCommentsArray);
}

// Getter functions
export function getUserOrganizedTal3as(userId: any): bigint[] {
  const userKey = userId.toString();
  return userOrganizedTal3as.get(userKey) || [];
}

export function getUserJoinedTal3as(userId: any): bigint[] {
  const userKey = userId.toString();
  return userJoinedTal3as.get(userKey) || [];
}

export function getGroupTal3as(groupId: bigint): bigint[] {
  return groupTal3as.get(groupId) || [];
}

export function getTal3aReviews(tal3aId: bigint): bigint[] {
  return tal3aReviews.get(tal3aId) || [];
}

export function getTal3aComments(tal3aId: bigint): bigint[] {
  return tal3aCommentsMap.get(tal3aId) || [];
}
