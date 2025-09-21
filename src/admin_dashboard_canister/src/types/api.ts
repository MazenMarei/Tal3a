/**
 * API type definitions for the admin dashboard
 *
 * These types represent the frontend application's data models,
 * which may differ from the canister interface types.
 */

export type AdminRequestStatus = "Pending" | "Approved" | "Rejected";

export interface AdminRequest {
  id: string;
  requester_principal: string;
  name: string;
  reason: string;
  status: AdminRequestStatus;
  requested_at: bigint;
  processed_at: bigint;
  processed_by?: string;
  rejection_reason?: string;
}

export type OwnerRole = "SuperAdmin" | "Admin" | "Moderator";

export type Permission =
  | "SystemConfiguration"
  | "ManageUsers"
  | "ViewAnalytics"
  | "ModerateContent"
  | "ManageGroups"
  | "ManageOwners";

export interface Owner {
  principal: string;
  name: string;
  role: OwnerRole;
  permissions: Permission[];
  created_at: bigint;
  created_by: string;
}

export interface ApiError {
  code: string;
  message: string;
  error: string;
}

export interface ProcessAdminRequestParams {
  request_id: string;
  action: "approve" | "reject";
  rejection_reason?: string;
}

export interface PaginationParams {
  offset?: number;
  limit?: number;
}

export interface AdminRequestFilters {
  status?: AdminRequestStatus[];
  date_from?: bigint;
  date_to?: bigint;
}

// Statistics types
export interface AdminRequestStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

// Bulk operations
export interface BulkProcessRequest {
  request_ids: string[];
  action: "approve" | "reject";
  rejection_reason?: string;
}

export interface BulkProcessResult {
  successful: string[];
  failed: Array<{
    request_id: string;
    error: string;
  }>;
}
