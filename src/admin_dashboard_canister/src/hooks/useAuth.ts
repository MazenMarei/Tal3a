import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAuthenticated, login, logout } from "../lib/auth";
/**
 * Enhanced authentication hooks for admin dashboard
 */

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (type: "ii" | "nfid") => {
      await login(type);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["isAuthenticated"] });
      queryClient.invalidateQueries({ queryKey: ["ownerInfo"] });
      queryClient.invalidateQueries({ queryKey: ["isOwner"] });
      queryClient.invalidateQueries({ queryKey: ["isSuperAdmin"] });
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      // Clear all user-related queries
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      queryClient.removeQueries({ queryKey: ["ownerInfo"] });
      queryClient.removeQueries({ queryKey: ["isOwner"] });
      queryClient.removeQueries({ queryKey: ["isSuperAdmin"] });
      queryClient.invalidateQueries({ queryKey: ["isAuthenticated"] });

      // Reload page to ensure clean state
      window.location.reload();
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });
};

export const useIsAuthenticated = () => {
  return useQuery({
    queryKey: ["isAuthenticated"],
    queryFn: async () => {
      return await isAuthenticated();
    },
    refetchInterval: 30000, // Check every 30 seconds
    retry: false,
  });
};
