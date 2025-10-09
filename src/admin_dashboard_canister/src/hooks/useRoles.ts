/**
 * Role-based access control hooks for admin dashboard
 *
 * These hooks check user permissions and roles using the owners canister
 */

import { useQuery } from "@tanstack/react-query";
import { OwnersService } from "@/services/owners";
import { transformOwner, withErrorHandling } from "../utilities/transformers";
import type { Owner, OwnerRole } from "../types/api";

/**
 * Hook to get current user's owner information
 */
export function useCurrentOwner(enabled: boolean = true) {
  return useQuery({
    queryKey: ["current-owner"],
    queryFn: async (): Promise<Owner | null> => {
      return withErrorHandling(async () => {
        const actor =
          await OwnersService.getInstance().getOwnersCanisterActor();
        if (!actor) return null;

        const result = await actor.get_my_owner_info();

        // Handle Result type from canister
        if ("Ok" in result) {
          return transformOwner(result.Ok);
        } else {
          // User is not an owner (this is not an error)
          return null;
        }
      }, "Fetching current owner information");
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to check if current user is a Super Admin
 */
export function useIsSuperAdmin(): {
  isSuperAdmin: boolean;
  isLoading: boolean;
  error: Error | null;
} {
  const { data: owner, isLoading, error } = useCurrentOwner();

  return {
    isSuperAdmin: owner?.role === "SuperAdmin",
    isLoading,
    error,
  };
}

/**
 * Hook to check if current user is an Owner (Admin or Super Admin)
 */
export function useIsOwner(): {
  isOwner: boolean;
  isLoading: boolean;
  error: Error | null;
  role?: OwnerRole;
} {
  const { data: owner, isLoading, error } = useCurrentOwner();

  return {
    isOwner: owner !== null,
    isLoading,
    error,
    role: owner?.role,
  };
}

/**
 * Hook to check if current user has a specific permission
 */
export function useHasPermission(permission: string): {
  hasPermission: boolean;
  isLoading: boolean;
  error: Error | null;
} {
  const { data: owner, isLoading, error } = useCurrentOwner();

  return {
    hasPermission: owner?.permissions.includes(permission as any) ?? false,
    isLoading,
    error,
  };
}

/**
 * Hook to check multiple permissions at once
 */
export function useHasPermissions(permissions: string[]): {
  hasAllPermissions: boolean;
  hasAnyPermission: boolean;
  permissionMap: Record<string, boolean>;
  isLoading: boolean;
  error: Error | null;
} {
  const { data: owner, isLoading, error } = useCurrentOwner();

  const permissionMap: Record<string, boolean> = {};
  let hasAllPermissions = true;
  let hasAnyPermission = false;

  if (owner) {
    for (const permission of permissions) {
      const hasPermission = owner.permissions.includes(permission as any);
      permissionMap[permission] = hasPermission;

      if (!hasPermission) {
        hasAllPermissions = false;
      }
      if (hasPermission) {
        hasAnyPermission = true;
      }
    }
  } else {
    // If no owner data, user has no permissions
    for (const permission of permissions) {
      permissionMap[permission] = false;
    }
    hasAllPermissions = false;
    hasAnyPermission = false;
  }

  return {
    hasAllPermissions,
    hasAnyPermission,
    permissionMap,
    isLoading,
    error,
  };
}

/**
 * Hook to check if user can access admin requests management
 */
export function useCanManageAdminRequests() {
  const { isSuperAdmin, isLoading, error } = useIsSuperAdmin();

  return {
    canManage: isSuperAdmin,
    isLoading,
    error,
  };
}

/**
 * Hook to check if user can access user management
 */
export function useCanManageUsers() {
  const { hasPermission, isLoading, error } = useHasPermission("ManageUsers");

  return {
    canManage: hasPermission,
    isLoading,
    error,
  };
}

/**
 * Hook to check if user can access system configuration
 */
export function useCanManageSystem() {
  const { hasPermission, isLoading, error } = useHasPermission(
    "SystemConfiguration"
  );

  return {
    canManage: hasPermission,
    isLoading,
    error,
  };
}

/**
 * Hook to check if user can view analytics
 */
export function useCanViewAnalytics() {
  const { hasPermission, isLoading, error } = useHasPermission("ViewAnalytics");

  return {
    canView: hasPermission,
    isLoading,
    error,
  };
}

/**
 * Hook to check if user can moderate content
 */
export function useCanModerateContent() {
  const { hasPermission, isLoading, error } =
    useHasPermission("ModerateContent");

  return {
    canModerate: hasPermission,
    isLoading,
    error,
  };
}

/**
 * Hook to get user's complete role information
 */
export function useUserRole(): {
  role?: OwnerRole;
  permissions: string[];
  isOwner: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  isLoading: boolean;
  error: Error | null;
} {
  const { data: owner, isLoading, error } = useCurrentOwner();

  return {
    role: owner?.role,
    permissions: owner?.permissions || [],
    isOwner: owner !== null,
    isSuperAdmin: owner?.role === "SuperAdmin",
    isAdmin: owner?.role === "Admin",
    isModerator: owner?.role === "Moderator",
    isLoading,
    error,
  };
}
