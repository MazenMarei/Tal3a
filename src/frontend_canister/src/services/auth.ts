import { getUserActor, initAuthClient, initIdentity } from "./index";

const network = process.env.DFX_NETWORK;
const identityProvider =
  network === "ic"
    ? "https://identity.ic0.app" // Mainnet
    : "http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943"; // Local

const nfidProvider =
  network === "ic"
    ? "https://nfid.one" // Mainnet
    : "http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943"; // Local

export async function login(type: "ii" | "nfid") {
  const client = await initAuthClient();
  return new Promise<void>((resolve, reject) => {
    client.login({
      identityProvider: type === "ii" ? identityProvider : nfidProvider,
      onSuccess: async () => {
        await initIdentity();
        resolve();
      },
      onError: reject,
    });
  });
}

export async function logout() {
  const client = await initAuthClient();
  await client.logout();
}

export async function getCurrentUser() {
  const userActor = await getUserActor();
  if (userActor instanceof Error) {
    throw userActor;
  }
  if (!userActor) {
    throw new Error("User actor not initialized. Call initIdentity() first.");
  }
  return userActor.get_current_user();
}

export async function isAuthenticated() {
  const client = await initAuthClient();
  return client.isAuthenticated();
}

export default {
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
};
