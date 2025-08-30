import { getUserActor, initAuthClient, initIdentity } from "./index";

export async function getAllGovernorates() {
  const userActor = await getUserActor();
  if (userActor instanceof Error) {
    throw userActor;
  }
  if (!userActor) {
    throw new Error("User actor not initialized. Call initIdentity() first.");
  }
  return userActor.get_all_governorates();
}

export async function getGovernorate(governorateId: number) {
  const userActor = await getUserActor();
  if (userActor instanceof Error) {
    throw userActor;
  }
  if (!userActor) {
    throw new Error("User actor not initialized. Call initIdentity() first.");
  }
  return userActor.get_governorate(governorateId);
}

export async function getAllGovernorateCities(governorateId: number) {
  const userActor = await getUserActor();
  if (userActor instanceof Error) {
    throw userActor;
  }
  if (!userActor) {
    throw new Error("User actor not initialized. Call initIdentity() first.");
  }
  return userActor.get_all_cities_in_governorate(governorateId);
}
