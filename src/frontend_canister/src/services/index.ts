import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Identity  } from "@dfinity/agent";
import {
  createActor as createUserCanisterActor,
  user_canister,
} from "declarations/user_canister";
import { canisterId as userCanisterId } from "declarations/user_canister/index";

// ================================
// Network Configuration
// ================================
const network = process.env.DFX_NETWORK || "local";
const isLocal = network === "local";

// Local replica URL
const LOCAL_REPLICA_URL = "http://127.0.0.1:4943";
// IC mainnet URL
const IC_URL = "https://ic0.app";

// ================================
// 1. AuthClient Wrapper
// ================================
let authClient: AuthClient | null = null;
let identity: Identity | null = null;
let agent: HttpAgent | null = null;

export async function initAuthClient() {
  if (!authClient) {
    authClient = await AuthClient.create();
  }
  return authClient;
}

export async function initIdentity() {
  if (!identity) {
    const authClient = await initAuthClient();
    identity = authClient.getIdentity();
  }
  return identity;
}

// ================================
// 2. Agent Configuration
// ================================
export async function createAgent(identity?: Identity): Promise<HttpAgent> {
  const host = isLocal ? LOCAL_REPLICA_URL : IC_URL;

  const agent = new HttpAgent({
    host,
    identity,
  });

  // Fetch root key for local development only
  if (isLocal) {
    try {
      await agent.fetchRootKey();
      console.log("✅ Root key fetched for local development");
    } catch (error) {
      console.warn("⚠️  Failed to fetch root key:", error);
      console.log("Make sure your local replica is running: dfx start");
    }
  }

  return agent;
}

// ================================
// 3. Exported Actors
// ================================
export async function getUserActor(): Promise<typeof user_canister | null> {
  try {
    if (!identity) {
      await initIdentity();
      if (!identity) {
        throw new Error("Identity not initialized. Call initIdentity() first.");
      }
    }

    // Create agent with proper configuration
    if (!agent) {
      agent = await createAgent(identity);
    }

    console.log(
      "Creating user canister actor",
      identity.getPrincipal().toString(),
      userCanisterId
    );

    return createUserCanisterActor(userCanisterId, {
      agent,
    });
  } catch (error) {
    console.error("Failed to create user actor:", error);
    return null;
  }
}

// ================================
// 4. Utility Functions
// ================================
export function getNetworkConfig() {
  return {
    network,
    isLocal,
    host: isLocal ? LOCAL_REPLICA_URL : IC_URL,
  };
}
