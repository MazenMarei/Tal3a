import { ic, Result, Ok, Err, Opt } from "azle/experimental";
import {
  tal3as,
  getNextTal3aId,
  addTal3aToUser,
  addTal3aToGroup,
  addTal3aToSport,
  addTal3aToLocation,
  getUserOrganizedTal3as,
  removeTal3aFromUser,
} from "../storage";
import {
  validateTal3aTitle,
  validateTal3aDescription,
  validateTal3aTiming,
  validateMaxParticipants,
  validateEntryFee,
  validateLocation,
  getCurrentTime,
  canEditTal3a,
  canDeleteTal3a,
  sportToString,
  sanitizeText,
  generateTal3aReference,
} from "../utils";

// Create a new Tal3a
export function createTal3a(tal3aData: any): Result<any, string> {
  try {
    const caller = ic.caller();
    const currentTime = getCurrentTime();

    // Validate required fields
    const titleValidation = validateTal3aTitle(tal3aData.title);
    if (titleValidation) {
      return Err(titleValidation);
    }

    const descriptionValidation = validateTal3aDescription(
      tal3aData.description
    );
    if (descriptionValidation) {
      return Err(descriptionValidation);
    }

    const timingValidation = validateTal3aTiming(
      tal3aData.start_time,
      tal3aData.end_time
    );
    if (timingValidation) {
      return Err(timingValidation);
    }

    const participantsValidation = validateMaxParticipants(
      tal3aData.max_participants
    );
    if (participantsValidation) {
      return Err(participantsValidation);
    }

    const feeValidation = validateEntryFee(tal3aData.pricing.entry_fee);
    if (feeValidation) {
      return Err(feeValidation);
    }

    const locationValidation = validateLocation(
      tal3aData.location.latitude,
      tal3aData.location.longitude,
      tal3aData.location.address
    );
    if (locationValidation) {
      return Err(locationValidation);
    }

    // Generate new ID
    const tal3aId = getNextTal3aId();

    // Create the Tal3a object
    const newTal3a = {
      id: tal3aId,
      title: sanitizeText(tal3aData.title),
      description: sanitizeText(tal3aData.description),
      sport: tal3aData.sport,
      organizer_id: caller,
      group_id: tal3aData.group_id,
      location: {
        ...tal3aData.location,
        address: sanitizeText(tal3aData.location.address),
      },
      start_time: tal3aData.start_time,
      end_time: tal3aData.end_time,
      max_participants: tal3aData.max_participants,
      current_participants: 0n,
      participants: [],
      waitlist: [],
      status: { Planned: null },
      difficulty_level: tal3aData.difficulty_level,
      requirements: tal3aData.requirements,
      pricing: tal3aData.pricing,
      media_attachments: tal3aData.media_attachments || [],
      tags: tal3aData.tags.map((tag: string) => sanitizeText(tag)),
      featured_image: tal3aData.featured_image,
      is_recurring: tal3aData.is_recurring || false,
      recurrence_pattern: tal3aData.recurrence_pattern,
      weather_dependent: tal3aData.weather_dependent || false,
      contact_info: tal3aData.contact_info,
      emergency_contact: tal3aData.emergency_contact,
      rules_and_regulations: tal3aData.rules_and_regulations,
      created_at: currentTime,
      updated_at: currentTime,
      cancelled_reason: { None: null },
      views_count: 0n,
      shares_count: 0n,
      favorites_count: 0n,
      reviews_count: 0n,
      average_rating: "0.0",
      is_featured: false,
      is_verified: false,
      verification_badge: { None: null },
      related_events: [],
      sponsors: tal3aData.sponsors || [],
      prizes: tal3aData.prizes || [],
      certificates: tal3aData.certificates || false,
    };

    // Store the Tal3a
    tal3as.insert(tal3aId, newTal3a);

    // Update indexes
    addTal3aToUser(caller, tal3aId, true); // true = organizer

    if (tal3aData.group_id.Some) {
      addTal3aToGroup(tal3aData.group_id.Some, tal3aId);
    }

    addTal3aToSport(sportToString(tal3aData.sport), tal3aId);
    addTal3aToLocation(
      tal3aData.location.city_id,
      tal3aData.location.governorate_id,
      tal3aId
    );

    return Ok(newTal3a);
  } catch (error) {
    return Err(`Failed to create Tal3a: ${error}`);
  }
}

// Update an existing Tal3a
export function updateTal3a(
  tal3aId: bigint,
  updateData: any
): Result<any, string> {
  try {
    const caller = ic.caller();
    const tal3aOpt = tal3as.get(tal3aId);

    if (!tal3aOpt) {
      return Err("Tal3a not found");
    }

    const tal3a = tal3aOpt;

    // Check permissions
    const canEdit = canEditTal3a(tal3a, caller);
    if (canEdit) {
      return Err(canEdit);
    }

    // Validate updates
    if (updateData.title.Some) {
      const titleValidation = validateTal3aTitle(updateData.title.Some);
      if (titleValidation) {
        return Err(titleValidation);
      }
    }

    if (updateData.description.Some) {
      const descriptionValidation = validateTal3aDescription(
        updateData.description.Some
      );
      if (descriptionValidation) {
        return Err(descriptionValidation);
      }
    }

    if (updateData.start_time.Some && updateData.end_time.Some) {
      const timingValidation = validateTal3aTiming(
        updateData.start_time.Some,
        updateData.end_time.Some
      );
      if (timingValidation) {
        return Err(timingValidation);
      }
    } else if (updateData.start_time.Some) {
      const timingValidation = validateTal3aTiming(
        updateData.start_time.Some,
        tal3a.end_time
      );
      if (timingValidation) {
        return Err(timingValidation);
      }
    } else if (updateData.end_time.Some) {
      const timingValidation = validateTal3aTiming(
        tal3a.start_time,
        updateData.end_time.Some
      );
      if (timingValidation) {
        return Err(timingValidation);
      }
    }

    if (updateData.max_participants.Some) {
      const participantsValidation = validateMaxParticipants(
        updateData.max_participants.Some
      );
      if (participantsValidation) {
        return Err(participantsValidation);
      }

      // Check if new max is less than current participants
      if (updateData.max_participants.Some < tal3a.current_participants) {
        return Err(
          "Cannot reduce max participants below current participant count"
        );
      }
    }

    // Create updated Tal3a
    const updatedTal3a = {
      ...tal3a,
      title: updateData.title.Some
        ? sanitizeText(updateData.title.Some)
        : tal3a.title,
      description: updateData.description.Some
        ? sanitizeText(updateData.description.Some)
        : tal3a.description,
      location: updateData.location.Some
        ? {
            ...updateData.location.Some,
            address: sanitizeText(updateData.location.Some.address),
          }
        : tal3a.location,
      start_time: updateData.start_time.Some || tal3a.start_time,
      end_time: updateData.end_time.Some || tal3a.end_time,
      max_participants:
        updateData.max_participants.Some || tal3a.max_participants,
      difficulty_level:
        updateData.difficulty_level.Some || tal3a.difficulty_level,
      requirements: updateData.requirements.Some || tal3a.requirements,
      pricing: updateData.pricing.Some || tal3a.pricing,
      media_attachments:
        updateData.media_attachments.Some || tal3a.media_attachments,
      tags: updateData.tags.Some
        ? updateData.tags.Some.map((tag: string) => sanitizeText(tag))
        : tal3a.tags,
      featured_image: updateData.featured_image.Some || tal3a.featured_image,
      weather_dependent:
        updateData.weather_dependent.Some !== undefined
          ? updateData.weather_dependent.Some
          : tal3a.weather_dependent,
      contact_info: updateData.contact_info.Some || tal3a.contact_info,
      emergency_contact:
        updateData.emergency_contact.Some || tal3a.emergency_contact,
      rules_and_regulations:
        updateData.rules_and_regulations.Some || tal3a.rules_and_regulations,
      sponsors: updateData.sponsors.Some || tal3a.sponsors,
      prizes: updateData.prizes.Some || tal3a.prizes,
      certificates:
        updateData.certificates.Some !== undefined
          ? updateData.certificates.Some
          : tal3a.certificates,
      updated_at: getCurrentTime(),
    };

    // Store the updated Tal3a
    tal3as.insert(tal3aId, updatedTal3a);

    return Ok(updatedTal3a);
  } catch (error) {
    return Err(`Failed to update Tal3a: ${error}`);
  }
}

// Delete a Tal3a
export function deleteTal3a(tal3aId: bigint): Result<any, string> {
  try {
    const caller = ic.caller();
    const tal3aOpt = tal3as.get(tal3aId);

    if (!tal3aOpt) {
      return Err("Tal3a not found");
    }

    const tal3a = tal3aOpt;

    // Check permissions
    const canDelete = canDeleteTal3a(tal3a, caller);
    if (canDelete) {
      return Err(canDelete);
    }

    // Remove from storage
    tal3as.remove(tal3aId);

    // Update indexes
    removeTal3aFromUser(caller, tal3aId, true); // true = organizer

    return Ok(null);
  } catch (error) {
    return Err(`Failed to delete Tal3a: ${error}`);
  }
}

// Get Tal3a by ID
export function getTal3a(tal3aId: bigint): Opt<any> {
  return tal3as.get(tal3aId) ? { Some: tal3as.get(tal3aId) } : { None: null };
}

// Get all Tal3as (with optional filtering)
export function getAllTal3as(filter?: any): any[] {
  let allTal3as = Array.from(tal3as.values());

  if (!filter) {
    return allTal3as;
  }

  return allTal3as.filter((tal3a) => {
    // Filter by sport
    if (filter.sport.Some && !isSameSport(tal3a.sport, filter.sport.Some)) {
      return false;
    }

    // Filter by city
    if (filter.city_id.Some && tal3a.location.city_id !== filter.city_id.Some) {
      return false;
    }

    // Filter by governorate
    if (
      filter.governorate_id.Some &&
      tal3a.location.governorate_id !== filter.governorate_id.Some
    ) {
      return false;
    }

    // Filter by status
    if (filter.status.Some && !isSameStatus(tal3a.status, filter.status.Some)) {
      return false;
    }

    // Filter by difficulty level
    if (
      filter.difficulty_level.Some &&
      !isSameStatus(tal3a.difficulty_level, filter.difficulty_level.Some)
    ) {
      return false;
    }

    // Filter by date range
    if (filter.start_date.Some && tal3a.start_time < filter.start_date.Some) {
      return false;
    }

    if (filter.end_date.Some && tal3a.start_time > filter.end_date.Some) {
      return false;
    }

    // Filter by max fee
    if (filter.max_fee.Some && tal3a.pricing.entry_fee > filter.max_fee.Some) {
      return false;
    }

    // Filter by organizer
    if (
      filter.organizer_id.Some &&
      tal3a.organizer_id.toString() !== filter.organizer_id.Some.toString()
    ) {
      return false;
    }

    // Filter by group
    if (filter.group_id.Some && tal3a.group_id.Some !== filter.group_id.Some) {
      return false;
    }

    // Filter by features
    if (
      filter.has_prizes.Some &&
      tal3a.prizes.length > 0 !== filter.has_prizes.Some
    ) {
      return false;
    }

    if (
      filter.provides_certificates.Some &&
      tal3a.certificates !== filter.provides_certificates.Some
    ) {
      return false;
    }

    if (
      filter.is_featured.Some &&
      tal3a.is_featured !== filter.is_featured.Some
    ) {
      return false;
    }

    if (
      filter.is_verified.Some &&
      tal3a.is_verified !== filter.is_verified.Some
    ) {
      return false;
    }

    return true;
  });
}

// Get user's organized Tal3as
export function getUserOrganizedTal3asData(userId: any): any[] {
  const tal3aIds = getUserOrganizedTal3as(userId);
  return tal3aIds.map((id) => tal3as.get(id)).filter((tal3a) => tal3a !== null);
}

// Update Tal3a status
export function updateTal3aStatus(
  tal3aId: bigint,
  newStatus: any
): Result<any, string> {
  try {
    const caller = ic.caller();
    const tal3aOpt = tal3as.get(tal3aId);

    if (!tal3aOpt) {
      return Err("Tal3a not found");
    }

    const tal3a = tal3aOpt;

    // Check if caller is the organizer
    if (tal3a.organizer_id.toString() !== caller.toString()) {
      return Err("Only the organizer can update Tal3a status");
    }

    const updatedTal3a = {
      ...tal3a,
      status: newStatus,
      updated_at: getCurrentTime(),
    };

    tal3as.insert(tal3aId, updatedTal3a);

    return Ok(updatedTal3a);
  } catch (error) {
    return Err(`Failed to update Tal3a status: ${error}`);
  }
}

// Helper function for same sport comparison (imported from utils)
function isSameSport(sport1: any, sport2: any): boolean {
  return sportToString(sport1) === sportToString(sport2);
}

// Helper function for same status comparison (imported from utils)
function isSameStatus(status1: any, status2: any): boolean {
  return JSON.stringify(status1) === JSON.stringify(status2);
}
