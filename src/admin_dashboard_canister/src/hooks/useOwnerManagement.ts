/**
 * useAddOwner Hook
 *
 * Hook for adding new platform owners with proper validation and error handling
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Principal } from "@dfinity/principal";
import { getOwnersActor } from "../../../frontend_canister/src/services/owners";
import { withErrorHandling } from "../utilities/transformers";
import type {
  Permission,
  OwnerRole,
} from "../../../declarations/owners_canister/owners_canister.did";

interface AddOwnerData {
  principal: string;
  name: string;
  role: "SuperAdmin" | "Admin" | "Moderator";
  permissions: string[];
}

export const useAddOwner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddOwnerData) => {
      return withErrorHandling(async () => {
        const actor = await getOwnersActor();
        if (!actor) {
          throw new Error("Failed to initialize owners canister actor");
        }

        // Validate and convert principal
        let principal: Principal;
        try {
          principal = Principal.fromText(data.principal.trim());
        } catch (error) {
          throw new Error("Invalid principal ID format");
        }

        // Convert role to backend format
        const role = { [data.role]: null } as OwnerRole;

        // Convert permissions to backend format
        const permissions: Permission[] = data.permissions.map(
          (permission) => ({ [permission]: null }) as Permission
        );

        // Call backend add_owner method
        const result = await actor.add_owner(
          principal,
          data.name.trim(),
          role,
          permissions
        );

        if ("Err" in result) {
          throw new Error(`Failed to add owner: ${result.Err.message}`);
        }

        return result.Ok;
      }, "Adding owner");
    },
    onSuccess: () => {
      // Invalidate and refetch owners data
      queryClient.invalidateQueries({ queryKey: ["owners"] });
    },
    onError: (error) => {
      console.error("Add owner failed:", error);
    },
  });
};

/**
 * useRemoveOwner Hook
 *
 * Hook for removing platform owners
 */
export const useRemoveOwner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principalText: string) => {
      return withErrorHandling(async () => {
        const actor = await getOwnersActor();
        if (!actor) {
          throw new Error("Failed to initialize owners canister actor");
        }

        // Convert principal text to Principal object
        let principal: Principal;
        try {
          principal = Principal.fromText(principalText);
        } catch (error) {
          throw new Error("Invalid principal ID format");
        }

        // Call backend remove_owner method
        const result = await actor.remove_owner(principal);

        if ("Err" in result) {
          throw new Error(`Failed to remove owner: ${result.Err.message}`);
        }

        return result.Ok;
      }, "Removing owner");
    },
    onSuccess: () => {
      // Invalidate and refetch owners data
      queryClient.invalidateQueries({ queryKey: ["owners"] });
    },
    onError: (error) => {
      console.error("Remove owner failed:", error);
    },
  });
};

/**
 * useUpdateOwnerPermissions Hook
 *
 * Hook for updating owner permissions
 */
export const useUpdateOwnerPermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { principal: string; permissions: string[] }) => {
      return withErrorHandling(async () => {
        const actor = await getOwnersActor();
        if (!actor) {
          throw new Error("Failed to initialize owners canister actor");
        }

        // Convert principal text to Principal object
        let principal: Principal;
        try {
          principal = Principal.fromText(data.principal);
        } catch (error) {
          throw new Error("Invalid principal ID format");
        }

        // Convert permissions to backend format
        const permissions: Permission[] = data.permissions.map(
          (permission) => ({ [permission]: null }) as Permission
        );

        // Call backend update_owner_permissions method
        const result = await actor.update_owner_permissions(
          principal,
          permissions
        );

        if ("Err" in result) {
          throw new Error(
            `Failed to update permissions: ${result.Err.message}`
          );
        }

        return result.Ok;
      }, "Updating owner permissions");
    },
    onSuccess: () => {
      // Invalidate and refetch owners data
      queryClient.invalidateQueries({ queryKey: ["owners"] });
    },
    onError: (error) => {
      console.error("Update owner permissions failed:", error);
    },
  });
};
