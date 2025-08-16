import { Canister, query, update, ic, text, nat64 } from "azle/experimental";
import {
  createTal3a,
  updateTal3a,
  deleteTal3a,
  getTal3a,
  getAllTal3as,
  getUserOrganizedTal3asData,
  updateTal3aStatus,
} from "./services/tal3a_service";
import {
  joinTal3a,
  leaveTal3a,
  getTal3aParticipants,
  updateParticipantStatus,
  getUserParticipationHistory,
} from "./services/participant_service";
import {
  createReview,
  updateReview,
  deleteReview,
  getTal3aReviewsData,
  getReviewById,
  markReviewHelpful,
  reportReview,
} from "./services/review_service";

export default Canister({
  // Tal3a management functions
  createTal3a: update([text], text, (tal3aDataJson) => {
    try {
      const tal3aData = JSON.parse(tal3aDataJson);
      const result = createTal3a(tal3aData);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify({ success: false, error: `${error}` });
    }
  }),

  updateTal3a: update([nat64, text], text, (tal3aId, updateDataJson) => {
    try {
      const updateData = JSON.parse(updateDataJson);
      const result = updateTal3a(tal3aId, updateData);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify({ success: false, error: `${error}` });
    }
  }),

  deleteTal3a: update([nat64], text, (tal3aId) => {
    try {
      const result = deleteTal3a(tal3aId);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify({ success: false, error: `${error}` });
    }
  }),

  getTal3a: query([nat64], text, (tal3aId) => {
    try {
      const result = getTal3a(tal3aId);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify({ success: false, error: `${error}` });
    }
  }),

  getAllTal3as: query([text], text, (filterJson) => {
    try {
      const filter = filterJson ? JSON.parse(filterJson) : null;
      const result = getAllTal3as(filter);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify([]);
    }
  }),

  getUserOrganizedTal3as: query([text], text, (userId) => {
    try {
      const result = getUserOrganizedTal3asData(userId);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify([]);
    }
  }),

  updateTal3aStatus: update([nat64, text], text, (tal3aId, statusJson) => {
    try {
      const status = JSON.parse(statusJson);
      const result = updateTal3aStatus(tal3aId, status);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify({ success: false, error: `${error}` });
    }
  }),

  // Participant management functions
  joinTal3a: update([nat64, text], text, (tal3aId, notes) => {
    try {
      const result = joinTal3a(tal3aId, notes || undefined);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify({ success: false, error: `${error}` });
    }
  }),

  leaveTal3a: update([nat64], text, (tal3aId) => {
    try {
      const result = leaveTal3a(tal3aId);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify({ success: false, error: `${error}` });
    }
  }),

  getTal3aParticipants: query([nat64], text, (tal3aId) => {
    try {
      const result = getTal3aParticipants(tal3aId);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify({ success: false, error: `${error}` });
    }
  }),

  updateParticipantStatus: update(
    [nat64, text, text],
    text,
    (tal3aId, participantId, newStatus) => {
      try {
        const result = updateParticipantStatus(
          tal3aId,
          participantId,
          newStatus
        );
        return JSON.stringify(result);
      } catch (error) {
        return JSON.stringify({ success: false, error: `${error}` });
      }
    }
  ),

  getUserParticipationHistory: query([text], text, (userId) => {
    try {
      const result = getUserParticipationHistory(userId);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify([]);
    }
  }),

  // Review management functions
  createReview: update(
    [nat64, nat64, text, nat64, nat64, nat64],
    text,
    (
      tal3aId,
      rating,
      comment,
      organizationRating,
      venueRating,
      valueRating
    ) => {
      try {
        const result = createReview(
          tal3aId,
          Number(rating),
          comment || undefined,
          Number(organizationRating) || undefined,
          Number(venueRating) || undefined,
          Number(valueRating) || undefined
        );
        return JSON.stringify(result);
      } catch (error) {
        return JSON.stringify({ success: false, error: `${error}` });
      }
    }
  ),

  updateReview: update(
    [nat64, nat64, text, nat64, nat64, nat64],
    text,
    (
      reviewId,
      rating,
      comment,
      organizationRating,
      venueRating,
      valueRating
    ) => {
      try {
        const result = updateReview(
          reviewId,
          Number(rating) || undefined,
          comment || undefined,
          Number(organizationRating) || undefined,
          Number(venueRating) || undefined,
          Number(valueRating) || undefined
        );
        return JSON.stringify(result);
      } catch (error) {
        return JSON.stringify({ success: false, error: `${error}` });
      }
    }
  ),

  deleteReview: update([nat64], text, (reviewId) => {
    try {
      const result = deleteReview(reviewId);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify({ success: false, error: `${error}` });
    }
  }),

  getTal3aReviews: query([nat64], text, (tal3aId) => {
    try {
      const result = getTal3aReviewsData(tal3aId);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify([]);
    }
  }),

  getReview: query([nat64], text, (reviewId) => {
    try {
      const result = getReviewById(reviewId);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify({ success: false, error: `${error}` });
    }
  }),

  markReviewHelpful: update([nat64], text, (reviewId) => {
    try {
      const result = markReviewHelpful(reviewId);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify({ success: false, error: `${error}` });
    }
  }),

  reportReview: update([nat64], text, (reviewId) => {
    try {
      const result = reportReview(reviewId);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify({ success: false, error: `${error}` });
    }
  }),

  // Health check and utility functions
  healthCheck: query([], text, () => {
    return "Tal3a canister is running";
  }),

  whoami: query([], text, () => {
    return ic.caller().toString();
  }),

  getCurrentTime: query([], nat64, () => {
    return ic.time();
  }),
});
