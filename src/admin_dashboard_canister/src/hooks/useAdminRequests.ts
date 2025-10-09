/**
 * Real API integration hooks for admin request management
 *
 * This file replaces the mock implementation with actual Internet Computer
 * canister integration using the owners canister service.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OwnersService } from "@/services/owners";
import {
  transformAdminRequestArray,
  transformAdminRequest,
  withErrorHandling,
  createOptional,
} from "../utilities/transformers";
import type {
  AdminRequest,
  ProcessAdminRequestParams,
  BulkProcessRequest,
  BulkProcessResult,
  AdminRequestStats,
} from "../types/api";

/**
 * Hook to fetch all admin requests with optional filtering
 */
export function useAllAdminRequests(enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-requests", "all"],
    queryFn: async (): Promise<AdminRequest[]> => {
      return withErrorHandling(async () => {
        const actor = await OwnersService.getInstance().getOwnersCanisterActor();
        if (!actor)
          throw new Error("Failed to initialize owners canister actor");

        const result = await actor.get_all_admin_requests();
        if ("Ok" in result) {
          return transformAdminRequestArray(result.Ok);
        } else {
          throw new Error(`API Error: ${result.Err.message}`);
        }
      }, "Fetching admin requests");
    },
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to fetch pending admin requests
 */
export function usePendingAdminRequests(enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-requests", "pending"],
    queryFn: async (): Promise<AdminRequest[]> => {
      return withErrorHandling(async () => {
        const actor = await OwnersService.getInstance().getOwnersCanisterActor();
        if (!actor)
          throw new Error("Failed to initialize owners canister actor");

        const result = await actor.get_pending_admin_requests();
        if ("Ok" in result) {
          return transformAdminRequestArray(result.Ok);
        } else {
          throw new Error(`API Error: ${result.Err.message}`);
        }
      }, "Fetching pending admin requests");
    },
    enabled,
    staleTime: 1000 * 60 * 1, // 1 minute for pending requests
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true, // Auto-refresh for pending requests
  });
}

/**
 * Hook to get admin request statistics
 */
export function useAdminRequestStats(enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-requests", "stats"],
    queryFn: async (): Promise<AdminRequestStats> => {
      return withErrorHandling(async () => {
        const actor = await OwnersService.getInstance().getOwnersCanisterActor();
        if (!actor)
          throw new Error("Failed to initialize owners canister actor");

        const allRequestsResult = await actor.get_all_admin_requests();
        if (!("Ok" in allRequestsResult)) {
          throw new Error(`API Error: ${allRequestsResult.Err.message}`);
        }
        const requests = transformAdminRequestArray(allRequestsResult.Ok);

        return {
          total: requests.length,
          pending: requests.filter((r) => r.status === "Pending").length,
          approved: requests.filter((r) => r.status === "Approved").length,
          rejected: requests.filter((r) => r.status === "Rejected").length,
        };
      }, "Fetching admin request statistics");
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
  });
}

/**
 * Hook to process a single admin request (approve/reject)
 */
export function useProcessAdminRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      params: ProcessAdminRequestParams
    ): Promise<AdminRequest> => {
      return withErrorHandling(async () => {
        const actor = await OwnersService.getInstance().getOwnersCanisterActor();
        if (!actor)
          throw new Error("Failed to initialize owners canister actor");

        const processRequest = {
          request_id: params.request_id,
          approve: params.action === "approve",
          rejection_reason: createOptional(params.rejection_reason),
        };

        const result = await actor.process_admin_request(processRequest);

        if ("Ok" in result) {
          return transformAdminRequest(result.Ok);
        } else {
          throw new Error(`API Error: ${result.Err.message}`);
        }
      }, `Processing admin request (${params.action})`);
    },
    onSuccess: () => {
      // Invalidate and refetch all admin request queries
      queryClient.invalidateQueries({ queryKey: ["admin-requests"] });
    },
    onError: (error) => {
      console.error("Failed to process admin request:", error);
    },
  });
}

/**
 * Hook to submit a new admin request
 */
export function useSubmitAdminRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      name: string;
      reason: string;
    }): Promise<AdminRequest> => {
      return withErrorHandling(async () => {
        const actor = await OwnersService.getInstance().getOwnersCanisterActor();
        if (!actor)
          throw new Error("Failed to initialize owners canister actor");

        const createRequest = {
          name: params.name,
          reason: params.reason,
        };

        const result = await actor.submit_admin_request(createRequest);

        if ("Ok" in result) {
          return transformAdminRequest(result.Ok);
        } else {
          throw new Error(`API Error: ${result.Err.message}`);
        }
      }, "Submitting admin request");
    },
    onSuccess: () => {
      // Invalidate and refetch admin request queries
      queryClient.invalidateQueries({ queryKey: ["admin-requests"] });
    },
    onError: (error) => {
      console.error("Failed to submit admin request:", error);
    },
  });
}

/**
 * Hook for bulk processing admin requests
 * This implements client-side bulk operations since the canister
 * may not have a dedicated bulk endpoint
 */
export function useBulkProcessAdminRequests() {
  const queryClient = useQueryClient();
  const processRequest = useProcessAdminRequest();

  return useMutation({
    mutationFn: async (
      params: BulkProcessRequest
    ): Promise<BulkProcessResult> => {
      return withErrorHandling(async () => {
        const results: BulkProcessResult = {
          successful: [],
          failed: [],
        };

        // Process requests sequentially to avoid overwhelming the canister
        for (const requestId of params.request_ids) {
          try {
            await processRequest.mutateAsync({
              request_id: requestId,
              action: params.action,
              rejection_reason: params.rejection_reason,
            });
            results.successful.push(requestId);
          } catch (error) {
            results.failed.push({
              request_id: requestId,
              error: error instanceof Error ? error.message : "Unknown error",
            });
          }
        }

        return results;
      }, `Bulk ${params.action} admin requests`);
    },
    onSuccess: () => {
      // Invalidate and refetch all admin request queries
      queryClient.invalidateQueries({ queryKey: ["admin-requests"] });
    },
    onError: (error) => {
      console.error("Failed to bulk process admin requests:", error);
    },
  });
}

/**
 * Hook to get a specific admin request by ID
 */
export function useAdminRequestById(
  requestId: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ["admin-requests", "detail", requestId],
    queryFn: async (): Promise<AdminRequest | null> => {
      return withErrorHandling(async () => {
        const actor = await OwnersService.getInstance().getOwnersCanisterActor();
        if (!actor)
          throw new Error("Failed to initialize owners canister actor");

        const allRequestsResult = await actor.get_all_admin_requests();
        if (!("Ok" in allRequestsResult)) {
          throw new Error(`API Error: ${allRequestsResult.Err.message}`);
        }
        const requests = transformAdminRequestArray(allRequestsResult.Ok);

        return requests.find((r) => r.id === requestId) || null;
      }, "Fetching admin request details");
    },
    enabled: enabled && !!requestId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to prefetch admin requests for better UX
 */
export function usePrefetchAdminRequests() {
  const queryClient = useQueryClient();

  const prefetchAll = () => {
    queryClient.prefetchQuery({
      queryKey: ["admin-requests", "all"],
      queryFn: async () => {
        const actor = await OwnersService.getInstance().getOwnersCanisterActor();
        if (!actor)
          throw new Error("Failed to initialize owners canister actor");
        const result = await actor.get_all_admin_requests();
        if ("Ok" in result) {
          return transformAdminRequestArray(result.Ok);
        } else {
          throw new Error(`API Error: ${result.Err.message}`);
        }
      },
      staleTime: 1000 * 60 * 2,
    });
  };

  const prefetchPending = () => {
    queryClient.prefetchQuery({
      queryKey: ["admin-requests", "pending"],
      queryFn: async () => {
        const actor = await OwnersService.getInstance().getOwnersCanisterActor();
        if (!actor)
          throw new Error("Failed to initialize owners canister actor");
        const result = await actor.get_pending_admin_requests();
        if ("Ok" in result) {
          return transformAdminRequestArray(result.Ok);
        } else {
          throw new Error(`API Error: ${result.Err.message}`);
        }
      },
      staleTime: 1000 * 60 * 1,
    });
  };

  const prefetchStats = () => {
    queryClient.prefetchQuery({
      queryKey: ["admin-requests", "stats"],
      queryFn: async () => {
        const actor = await OwnersService.getInstance().getOwnersCanisterActor();
        if (!actor)
          throw new Error("Failed to initialize owners canister actor");
        const allRequestsResult = await actor.get_all_admin_requests();
        if (!("Ok" in allRequestsResult)) {
          throw new Error(`API Error: ${allRequestsResult.Err.message}`);
        }
        const requests = transformAdminRequestArray(allRequestsResult.Ok);

        return {
          total: requests.length,
          pending: requests.filter((r) => r.status === "Pending").length,
          approved: requests.filter((r) => r.status === "Approved").length,
          rejected: requests.filter((r) => r.status === "Rejected").length,
        };
      },
      staleTime: 1000 * 60 * 5,
    });
  };

  return {
    prefetchAll,
    prefetchPending,
    prefetchStats,
  };
}

/**
 * Hook to delete an admin request
 */
export function useDeleteAdminRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: string): Promise<void> => {
      return withErrorHandling(async () => {
        const actor = await OwnersService.getInstance().getOwnersCanisterActor();
        if (!actor)
          throw new Error("Failed to initialize owners canister actor");

        const result = await actor.delete_admin_request(requestId);
        if ("Err" in result) {
          throw new Error(`API Error: ${result.Err.message}`);
        }
      }, "Deleting admin request");
    },
    onSuccess: () => {
      // Invalidate relevant queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["admin-requests"] });
    },
  });
}
