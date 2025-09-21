/**
 * Owners Canister Service
 *
 * Service for interacting with the owners canister for admin management functionality
 */

import {
  createActor as createOwnersCanisterActor,
  owners_canister,
} from "../../../declarations/owners_canister";
import { canisterId as ownersCanisterId } from "../../../declarations/owners_canister/index";
import { createAgent, initIdentity } from "./index";

let ownersActor: typeof owners_canister | null = null;

/**
 * Get the owners canister actor with proper authentication
 */
export async function getOwnersActor(): Promise<typeof owners_canister | null> {
  try {
    // Initialize identity if not already done
    const identity = await initIdentity();

    if (!identity) {
      throw new Error("Identity not initialized. Please authenticate first.");
    }

    // Create agent with authenticated identity
    const agent = await createAgent(identity);

    console.log(
      "Creating owners canister actor",
      identity.getPrincipal().toString(),
      ownersCanisterId
    );

    // Create and cache the actor
    ownersActor = createOwnersCanisterActor(ownersCanisterId, {
      agent,
    });

    return ownersActor;
  } catch (error) {
    console.error("Failed to create owners actor:", error);
    return null;
  }
}

/**
 * Reset the cached owners actor (useful for re-authentication)
 */
export function resetOwnersActor(): void {
  ownersActor = null;
}

/**
 * Check if user has owners canister access
 */
export async function hasOwnersAccess(): Promise<boolean> {
  try {
    const actor = await getOwnersActor();
    if (!actor) return false;

    // Try to call a read-only method to check access
    await actor.get_pending_admin_requests();
    return true;
  } catch (error) {
    console.warn("User does not have owners canister access:", error);
    return false;
  }
}
