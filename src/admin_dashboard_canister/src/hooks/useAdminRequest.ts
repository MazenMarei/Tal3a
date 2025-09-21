import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateAdminRequest,
  ProcessAdminRequest,
  AdminRequest,
} from "../types/adminRequest";
import { OwnersService } from "@/services/owners";
import type { Result_6 } from "@/../../declarations/owners_canister/owners_canister.did";
import { AuthClientProvider } from "@/services";
import { AnonymousIdentity } from "@dfinity/agent";

/**
 * Hook for submitting admin access requests
 */
export const useSubmitAdminRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreateAdminRequest): Promise<Result_6> => {
      const ownerCanister =
        await OwnersService.getInstance().getOwnersCanisterActor();
      return await ownerCanister.submit_admin_request({
        name: request.name,
        reason: request.reason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminRequest"] });
      queryClient.invalidateQueries({ queryKey: ["myAdminRequest"] });
    },
    onError: (error) => {
      console.error("Failed to submit admin request:", error);
    },
  });
};

/**
 * Hook for getting user's own admin request
 */
export const useMyAdminRequest = () => {
  return useQuery({
    queryKey: ["myAdminRequest"],
    queryFn: async () => {
      const ownerCanister =
        await OwnersService.getInstance().getOwnersCanisterActor();
      return await ownerCanister.get_my_admin_request();
    },
    retry: false,
  });
};

/**
 * Hook for getting all admin requests (for super admins)
 */
export const useAllAdminRequests = () => {
  return useQuery({
    queryKey: ["allAdminRequests"],
    queryFn: async (): Promise<AdminRequest[]> => {
      // Mock implementation - will be replaced with actual API call
      return [];
    },
    retry: false,
  });
};

/**
 * Hook for getting pending admin requests (for super admins)
 */
export const usePendingAdminRequests = () => {
  return useQuery({
    queryKey: ["pendingAdminRequests"],
    queryFn: async (): Promise<AdminRequest[]> => {
      // Mock implementation
      return [];
    },
    retry: false,
  });
};

/**
 * Hook for processing admin requests (approve/reject)
 */
export const useProcessAdminRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: ProcessAdminRequest) => {
      // Mock implementation
      let ownerCanister =
        await OwnersService.getInstance().getOwnersCanisterActor();
      return await ownerCanister.process_admin_request({
        request_id: request.request_id,
        approve: request.approve,
        rejection_reason: [request.rejection_reason || ""],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allAdminRequests"] });
      queryClient.invalidateQueries({ queryKey: ["pendingAdminRequests"] });
    },
    onError: (error) => {
      console.error("Failed to process admin request:", error);
    },
  });
};

/**
 * Hook for checking if current user is an owner
 */
export const useIsOwner = () => {
  return useQuery({
    queryKey: ["isOwner"],
    queryFn: async (): Promise<boolean> => {
      try {
        let ownersCanister =
          await OwnersService.getInstance().getOwnersCanisterActor();
        return await ownersCanister.is_owner(
          AuthClientProvider.getInstance().getIdentity()?.getPrincipal() ||
            new AnonymousIdentity().getPrincipal()
        );
      } catch {
        return false;
      }
    },
    retry: false,
  });
};

/**
 * Hook for checking if current user is a super admin
 */
export const useIsSuperAdmin = () => {
  return useQuery({
    queryKey: ["isSuperAdmin"],
    queryFn: async (): Promise<boolean> => {
      try {
        const ownerInfo = await (
          await OwnersService.getInstance().getOwnersCanisterActor()
        ).get_my_owner_info();

        return "Ok" in ownerInfo && "SuperAdmin" in ownerInfo.Ok.role;
      } catch {
        return false;
      }
    },
    retry: false,
  });
};

/**
 * Hook for getting current user's owner information
 */
export const useOwnerInfo = () => {
  return useQuery({
    queryKey: ["ownerInfo"],
    queryFn: async () => {
      return await (
        await OwnersService.getInstance().getOwnersCanisterActor()
      ).get_my_owner_info();
    },
    retry: false,
  });
};
