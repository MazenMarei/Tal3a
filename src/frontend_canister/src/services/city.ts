import { getUserActor, initAuthClient, initIdentity } from "./index";

export async function getCity(cityId: number, governorateId: number) {
  const userActor = await getUserActor();
  if (userActor instanceof Error) {
    throw userActor;
  }
  if (!userActor) {
    throw new Error("User actor not initialized. Call initIdentity() first.");
  }
  return userActor.get_city(cityId, governorateId);
}