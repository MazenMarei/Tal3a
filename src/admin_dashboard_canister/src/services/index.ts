import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, type Agent, type Identity } from "@dfinity/agent";

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
export class AuthClientProvider {
  private static instance: AuthClientProvider;
  private authClient: AuthClient | null = null;
  private identity: Identity | null = null;
  private agent: Agent | null = null;

  private constructor() {
    // Private constructor to prevent direct instantiation
    this.initClient();
  }

  private async initClient() {
    if (!this.authClient) {
      this.authClient = await AuthClient.create();
      this.identity = this.authClient.getIdentity();
    }
  }

  public static getInstance(): AuthClientProvider {
    if (!AuthClientProvider.instance) {
      AuthClientProvider.instance = new AuthClientProvider();
    }
    return AuthClientProvider.instance;
  }

  public async initAuthClient() {
    if (!this.authClient) {
      this.authClient = await AuthClient.create();
    }
    return this.authClient;
  }

  public async initIdentity() {
    if (!this.identity) {
      const authClient = await this.initAuthClient();
      this.identity = authClient.getIdentity();
    }
    return this.identity;
  }

  public async initAgent() {
    if (!this.agent) {
      const identity = await this.initIdentity();
      const host = isLocal ? LOCAL_REPLICA_URL : IC_URL;

      this.agent = await HttpAgent.create({
        host,
        identity,
      });

      // Fetch root key for local development only
      if (isLocal) {
        try {
          await this.agent.fetchRootKey();
          console.log("✅ Root key fetched for local development");
        } catch (error) {
          console.warn("⚠️  Failed to fetch root key:", error);
          console.log("Make sure your local replica is running: dfx start");
        }
      }
    }
    return this.agent;
  }

  public getAuthClient() {
    return this.authClient;
  }
  public getIdentity() {
    return this.identity;
  }
  public getAgent() {
    return this.agent;
  }
}

// ================================
// 3. Exported Actors
// ================================
// export async function getOwnersActor(): Promise<typeof owners_canister | null> {
//   try {
//     if (!identity) {
//       await initIdentity();
//       if (!identity) {
//         throw new Error("Identity not initialized. Call initIdentity() first.");
//       }
//     }

//     // Create agent with proper configuration
//     if (!agent) {
//       agent = await createAgent(identity);
//     }

//     console.log(
//       "Creating Owners canister actor",
//       identity.getPrincipal().toString(),
//       ownersCanisterId
//     );

//     return createOwnersCanisterActor(ownersCanisterId, {
//       agent,
//     });
//   } catch (error) {
//     console.error("Failed to create user actor:", error);
//     return null;
//   }
// }

// ================================
// 4. Utility Functions
// ================================
// export function getNetworkConfig() {
//   return {
//     network,
//     isLocal,
//     host: isLocal ? LOCAL_REPLICA_URL : IC_URL,
//   };
// }
