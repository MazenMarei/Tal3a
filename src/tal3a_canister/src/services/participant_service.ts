import { ic } from "azle/experimental";
import {
  tal3as,
  addTal3aToUser,
  removeTal3aFromUser,
  getUserJoinedTal3as,
} from "../storage";
import { getCurrentTime } from "../utils";

export function joinTal3a(tal3aId: bigint, notes?: string): any {
  try {
    const caller = ic.caller();
    const currentTime = getCurrentTime();

    const tal3a = tal3as.get(tal3aId);
    if (!tal3a) {
      return { success: false, error: "Tal3a not found" };
    }

    // Check if already a participant
    const existingParticipant = tal3a.participants.find(
      (p: any) => p.user_id.toString() === caller.toString()
    );

    if (existingParticipant) {
      return { success: false, error: "User already joined this Tal3a" };
    }

    // Check if organizer trying to join their own event
    if (tal3a.organizer_id.toString() === caller.toString()) {
      return {
        success: false,
        error: "Organizers cannot join their own Tal3a",
      };
    }

    // Check if spots available
    if (tal3a.current_participants >= tal3a.max_participants) {
      // Add to waitlist
      const updatedWaitlist = [...tal3a.waitlist, caller];
      const updatedTal3a = {
        ...tal3a,
        waitlist: updatedWaitlist,
        updated_at: currentTime,
      };

      tal3as.insert(tal3aId, updatedTal3a);

      return {
        success: true,
        message: "Added to waitlist",
        status: "waitlisted",
      };
    }

    // Create participant record
    const participant = {
      user_id: caller,
      joined_at: currentTime,
      status: "Confirmed",
      payment_status: tal3a.pricing.entry_fee > 0 ? "Pending" : "NotRequired",
      notes: notes || null,
    };

    // Update tal3a participants
    const updatedParticipants = [...tal3a.participants, participant];
    const updatedTal3a = {
      ...tal3a,
      participants: updatedParticipants,
      current_participants: tal3a.current_participants + 1n,
      updated_at: currentTime,
    };

    tal3as.insert(tal3aId, updatedTal3a);

    // Update user's participated tal3as
    addTal3aToUser(caller, tal3aId, false); // false = participant

    return {
      success: true,
      data: participant,
      message: "Successfully joined Tal3a",
    };
  } catch (error) {
    return { success: false, error: `Failed to join Tal3a: ${error}` };
  }
}

export function leaveTal3a(tal3aId: bigint): any {
  try {
    const caller = ic.caller();
    const currentTime = getCurrentTime();

    const tal3a = tal3as.get(tal3aId);
    if (!tal3a) {
      return { success: false, error: "Tal3a not found" };
    }

    // Check if user is a participant
    const participantIndex = tal3a.participants.findIndex(
      (p: any) => p.user_id.toString() === caller.toString()
    );

    if (participantIndex === -1) {
      // Check if in waitlist
      const waitlistIndex = tal3a.waitlist.findIndex(
        (userId: any) => userId.toString() === caller.toString()
      );

      if (waitlistIndex === -1) {
        return { success: false, error: "User is not part of this Tal3a" };
      }

      // Remove from waitlist
      const updatedWaitlist = tal3a.waitlist.filter(
        (userId: any, index: number) => index !== waitlistIndex
      );

      const updatedTal3a = {
        ...tal3a,
        waitlist: updatedWaitlist,
        updated_at: currentTime,
      };

      tal3as.insert(tal3aId, updatedTal3a);

      return {
        success: true,
        message: "Removed from waitlist",
      };
    }

    // Remove from participants
    const updatedParticipants = tal3a.participants.filter(
      (p: any, index: number) => index !== participantIndex
    );

    // Check if we can promote someone from waitlist
    let updatedWaitlist = tal3a.waitlist;
    if (tal3a.waitlist.length > 0) {
      const promotedUser = tal3a.waitlist[0];
      updatedWaitlist = tal3a.waitlist.slice(1);

      // Add promoted user as participant
      const promotedParticipant = {
        user_id: promotedUser,
        joined_at: currentTime,
        status: "Confirmed",
        payment_status: tal3a.pricing.entry_fee > 0 ? "Pending" : "NotRequired",
        notes: null,
      };

      updatedParticipants.push(promotedParticipant);
    }

    const updatedTal3a = {
      ...tal3a,
      participants: updatedParticipants,
      waitlist: updatedWaitlist,
      current_participants: BigInt(updatedParticipants.length),
      updated_at: currentTime,
    };

    tal3as.insert(tal3aId, updatedTal3a);

    return {
      success: true,
      message: "Successfully left Tal3a",
    };
  } catch (error) {
    return { success: false, error: `Failed to leave Tal3a: ${error}` };
  }
}

export function getTal3aParticipants(tal3aId: bigint): any {
  try {
    const tal3a = tal3as.get(tal3aId);
    if (!tal3a) {
      return { success: false, error: "Tal3a not found" };
    }

    return {
      success: true,
      data: {
        participants: tal3a.participants,
        waitlist: tal3a.waitlist,
        current_participants: tal3a.current_participants,
        max_participants: tal3a.max_participants,
      },
    };
  } catch (error) {
    return { success: false, error: `Failed to get participants: ${error}` };
  }
}

export function updateParticipantStatus(
  tal3aId: bigint,
  participantId: string,
  newStatus: string
): any {
  try {
    const caller = ic.caller();
    const currentTime = getCurrentTime();

    const tal3a = tal3as.get(tal3aId);
    if (!tal3a) {
      return { success: false, error: "Tal3a not found" };
    }

    // Only organizer can update participant status
    if (tal3a.organizer_id.toString() !== caller.toString()) {
      return {
        success: false,
        error: "Only organizer can update participant status",
      };
    }

    const participantIndex = tal3a.participants.findIndex(
      (p: any) => p.user_id.toString() === participantId
    );

    if (participantIndex === -1) {
      return { success: false, error: "Participant not found" };
    }

    const updatedParticipants = [...tal3a.participants];
    updatedParticipants[participantIndex] = {
      ...updatedParticipants[participantIndex],
      status: newStatus,
    };

    const updatedTal3a = {
      ...tal3a,
      participants: updatedParticipants,
      updated_at: currentTime,
    };

    tal3as.insert(tal3aId, updatedTal3a);

    return {
      success: true,
      message: "Participant status updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to update participant status: ${error}`,
    };
  }
}

export function getUserParticipationHistory(userId: string): any[] {
  try {
    const userTal3aIds = getUserJoinedTal3as(userId);
    const participatedTal3as = userTal3aIds
      .map((id: bigint) => tal3as.get(id))
      .filter((tal3a: any) => tal3a !== null);

    return participatedTal3as;
  } catch (error) {
    return [];
  }
}
