import { ic } from "azle/experimental";
import {
  tal3as,
  reviews,
  getNextReviewId,
  addReviewToTal3a,
  getTal3aReviews,
  userReviews,
} from "../storage";
import { getCurrentTime } from "../utils";

export function createReview(
  tal3aId: bigint,
  rating: number,
  comment?: string,
  organizationRating?: number,
  venueRating?: number,
  valueRating?: number
): any {
  try {
    const caller = ic.caller();
    const currentTime = getCurrentTime();

    const tal3a = tal3as.get(tal3aId);
    if (!tal3a) {
      return { success: false, error: "Tal3a not found" };
    }

    // Check if user participated in this Tal3a
    const hasParticipated = tal3a.participants.some(
      (p: any) => p.user_id.toString() === caller.toString()
    );

    if (!hasParticipated) {
      return {
        success: false,
        error: "Only participants can review this Tal3a",
      };
    }

    // Check if user already reviewed this Tal3a
    const existingReviewIds = getTal3aReviews(tal3aId);
    const existingReview = existingReviewIds.find((reviewId: bigint) => {
      const review = reviews.get(reviewId);
      return review && review.reviewer_id.toString() === caller.toString();
    });

    if (existingReview) {
      return { success: false, error: "User has already reviewed this Tal3a" };
    }

    // Validate rating (1-5)
    if (rating < 1 || rating > 5) {
      return { success: false, error: "Rating must be between 1 and 5" };
    }

    // Generate new review ID
    const reviewId = getNextReviewId();

    // Create review object
    const newReview = {
      id: reviewId,
      tal3a_id: tal3aId,
      reviewer_id: caller,
      rating: rating,
      comment: comment || null,
      organization_rating: organizationRating || rating,
      venue_rating: venueRating || rating,
      value_rating: valueRating || rating,
      created_at: currentTime,
      is_verified: hasParticipated,
      helpful_count: 0n,
      reported_count: 0n,
    };

    // Store the review
    reviews.insert(reviewId, newReview);

    // Add to tal3a reviews
    addReviewToTal3a(tal3aId, reviewId);

    // Add to user reviews
    const userKey = caller.toString();
    const userReviewsArray = userReviews.get(userKey) || [];
    userReviewsArray.push(reviewId);
    userReviews.insert(userKey, userReviewsArray);

    // Update tal3a average rating and review count
    const updatedReviewIds = getTal3aReviews(tal3aId);
    const allReviews = updatedReviewIds
      .map((id: bigint) => reviews.get(id))
      .filter((review: any) => review !== null);

    const totalRating = allReviews.reduce(
      (sum: number, review: any) => sum + review.rating,
      0
    );
    const averageRating = (totalRating / allReviews.length).toFixed(1);

    const updatedTal3a = {
      ...tal3a,
      reviews_count: BigInt(allReviews.length),
      average_rating: averageRating,
      updated_at: currentTime,
    };

    tal3as.insert(tal3aId, updatedTal3a);

    return {
      success: true,
      data: newReview,
      message: "Review created successfully",
    };
  } catch (error) {
    return { success: false, error: `Failed to create review: ${error}` };
  }
}

export function updateReview(
  reviewId: bigint,
  rating?: number,
  comment?: string,
  organizationRating?: number,
  venueRating?: number,
  valueRating?: number
): any {
  try {
    const caller = ic.caller();
    const currentTime = getCurrentTime();

    const review = reviews.get(reviewId);
    if (!review) {
      return { success: false, error: "Review not found" };
    }

    // Check if caller is the reviewer
    if (review.reviewer_id.toString() !== caller.toString()) {
      return {
        success: false,
        error: "Only the reviewer can update this review",
      };
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return { success: false, error: "Rating must be between 1 and 5" };
    }

    // Update review
    const updatedReview = {
      ...review,
      rating: rating || review.rating,
      comment: comment !== undefined ? comment : review.comment,
      organization_rating: organizationRating || review.organization_rating,
      venue_rating: venueRating || review.venue_rating,
      value_rating: valueRating || review.value_rating,
    };

    reviews.insert(reviewId, updatedReview);

    // Update tal3a average rating if rating changed
    if (rating && rating !== review.rating) {
      const tal3aReviewIds = getTal3aReviews(review.tal3a_id);
      const allReviews = tal3aReviewIds
        .map((id: bigint) => reviews.get(id))
        .filter((r: any) => r !== null);

      const totalRating = allReviews.reduce(
        (sum: number, r: any) => sum + r.rating,
        0
      );
      const averageRating = (totalRating / allReviews.length).toFixed(1);

      const tal3a = tal3as.get(review.tal3a_id);
      if (tal3a) {
        const updatedTal3a = {
          ...tal3a,
          average_rating: averageRating,
          updated_at: currentTime,
        };
        tal3as.insert(review.tal3a_id, updatedTal3a);
      }
    }

    return {
      success: true,
      data: updatedReview,
      message: "Review updated successfully",
    };
  } catch (error) {
    return { success: false, error: `Failed to update review: ${error}` };
  }
}

export function deleteReview(reviewId: bigint): any {
  try {
    const caller = ic.caller();

    const review = reviews.get(reviewId);
    if (!review) {
      return { success: false, error: "Review not found" };
    }

    // Check if caller is the reviewer
    if (review.reviewer_id.toString() !== caller.toString()) {
      return {
        success: false,
        error: "Only the reviewer can delete this review",
      };
    }

    // Remove review
    reviews.remove(reviewId);

    // Update tal3a ratings
    const tal3aReviewIds = getTal3aReviews(review.tal3a_id);
    const remainingReviews = tal3aReviewIds
      .map((id: bigint) => reviews.get(id))
      .filter((r: any) => r !== null && r.id !== reviewId);

    const tal3a = tal3as.get(review.tal3a_id);
    if (tal3a) {
      let averageRating = "0.0";
      if (remainingReviews.length > 0) {
        const totalRating = remainingReviews.reduce(
          (sum: number, r: any) => sum + r.rating,
          0
        );
        averageRating = (totalRating / remainingReviews.length).toFixed(1);
      }

      const updatedTal3a = {
        ...tal3a,
        reviews_count: BigInt(remainingReviews.length),
        average_rating: averageRating,
        updated_at: getCurrentTime(),
      };
      tal3as.insert(review.tal3a_id, updatedTal3a);
    }

    return {
      success: true,
      message: "Review deleted successfully",
    };
  } catch (error) {
    return { success: false, error: `Failed to delete review: ${error}` };
  }
}

export function getTal3aReviewsData(tal3aId: bigint): any[] {
  try {
    const reviewIds = getTal3aReviews(tal3aId);
    const reviewsData = reviewIds
      .map((id: bigint) => reviews.get(id))
      .filter((review: any) => review !== null)
      .sort((a: any, b: any) => Number(b.created_at - a.created_at));

    return reviewsData;
  } catch (error) {
    return [];
  }
}

export function getReviewById(reviewId: bigint): any {
  try {
    const review = reviews.get(reviewId);
    if (!review) {
      return { success: false, error: "Review not found" };
    }

    return { success: true, data: review };
  } catch (error) {
    return { success: false, error: `Failed to get review: ${error}` };
  }
}

export function markReviewHelpful(reviewId: bigint): any {
  try {
    const review = reviews.get(reviewId);
    if (!review) {
      return { success: false, error: "Review not found" };
    }

    const updatedReview = {
      ...review,
      helpful_count: review.helpful_count + 1n,
    };

    reviews.insert(reviewId, updatedReview);

    return {
      success: true,
      message: "Review marked as helpful",
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to mark review as helpful: ${error}`,
    };
  }
}

export function reportReview(reviewId: bigint): any {
  try {
    const review = reviews.get(reviewId);
    if (!review) {
      return { success: false, error: "Review not found" };
    }

    const updatedReview = {
      ...review,
      reported_count: review.reported_count + 1n,
    };

    reviews.insert(reviewId, updatedReview);

    return {
      success: true,
      message: "Review reported successfully",
    };
  } catch (error) {
    return { success: false, error: `Failed to report review: ${error}` };
  }
}
