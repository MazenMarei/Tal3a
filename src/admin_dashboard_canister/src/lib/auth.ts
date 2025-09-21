import { OwnersService } from "@/services/owners";
import { AuthClient } from "@dfinity/auth-client";

const network = process.env.DFX_NETWORK;
const identityProvider =
  network === "ic"
    ? "https://identity.ic0.app" // Mainnet
    : "http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943"; // Local

const nfidProvider =
  network === "ic"
    ? "https://nfid.one" // Mainnet
    : "http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943"; // Local

export async function login(provider: "ii" | "nfid"): Promise<void> {
  const client = await AuthClient.create();
  return new Promise<void>((resolve, reject) => {
    client.login({
      identityProvider: provider === "ii" ? identityProvider : nfidProvider,
      onSuccess: async () => {
        resolve();
      },
      onError: reject,
    });
  });
}

export async function logout(): Promise<void> {
  const client = await AuthClient.create();
  await client.logout();
  window.location.reload();
}

export async function isAuthenticated(): Promise<boolean> {
  const client = await AuthClient.create();
  return client.isAuthenticated();
}

export async function getCurrentUser() {
  try {
    return (
      await OwnersService.getInstance().getOwnersCanisterActor()
    ).get_my_owner_info();
  } catch (error) {
    console.error("Failed to get current user:", error);
    throw error;
  }
}
