import { AuthClientProvider } from ".";
import { createActor as createOwnersCanisterActor } from "../../../declarations/owners_canister";
import { canisterId as ownersCanisterId } from "@/../../declarations/owners_canister/index";

export class OwnersService {
  private authClientProvider = AuthClientProvider.getInstance();
  private static instance: OwnersService;
  private constructor() {}

  public static getInstance(): OwnersService {
    if (!OwnersService.instance) {
      OwnersService.instance = new OwnersService();
    }
    return OwnersService.instance;
  }

  public async getOwnersCanisterActor() {
    let agent = this.authClientProvider.getAgent();
    if (!agent) {
      agent = await this.authClientProvider.initAgent();
    }

    return createOwnersCanisterActor(ownersCanisterId, {
      agent,
    });
  }
}
