/**
 * Data transformation utilities for converting between canister types and frontend types
 *
 * This module handles the transformation of data types between the Internet Computer
 * canister interface and the frontend application interface.
 */

import { Principal } from "@dfinity/principal";
import type {
  AdminRequest as CanisterAdminRequest,
  AdminRequestStatus as CanisterAdminRequestStatus,
  Owner as CanisterOwner,
  OwnerRole as CanisterOwnerRole,
  Permission as CanisterPermission,
  Error as CanisterError,
} from "../../../declarations/owners_canister/owners_canister.did";
import type {
  AdminRequest,
  AdminRequestStatus,
  Owner,
  OwnerRole,
  Permission,
  ApiError,
} from "../types/api";

/**
 * Transform AdminRequestStatus from canister to frontend format
 */
export function transformAdminRequestStatus(
  status: CanisterAdminRequestStatus
): AdminRequestStatus {
  if ("Pending" in status) return "Pending";
  if ("Approved" in status) return "Approved";
  if ("Rejected" in status) return "Rejected";
  throw new Error(`Unknown admin request status: ${JSON.stringify(status)}`);
}

/**
 * Transform AdminRequest from canister to frontend format
 */
export function transformAdminRequest(
  canisterRequest: CanisterAdminRequest
): AdminRequest {
  return {
    id: canisterRequest.id,
    requester_principal: canisterRequest.requester_principal.toString(),
    name: canisterRequest.name,
    reason: canisterRequest.reason,
    status: transformAdminRequestStatus(canisterRequest.status),
    requested_at: canisterRequest.requested_at,
    processed_at:
      canisterRequest.processed_at.length > 0 &&
      canisterRequest.processed_at[0] !== undefined
        ? canisterRequest.processed_at[0]
        : 0n,
    processed_by:
      canisterRequest.processed_by.length > 0 && canisterRequest.processed_by[0]
        ? canisterRequest.processed_by[0].toString()
        : undefined,
    rejection_reason:
      canisterRequest.rejection_reason.length > 0
        ? canisterRequest.rejection_reason[0]
        : undefined,
  };
}

/**
 * Transform array of AdminRequests from canister to frontend format
 */
export function transformAdminRequestArray(
  canisterRequests: CanisterAdminRequest[]
): AdminRequest[] {
  return canisterRequests.map(transformAdminRequest);
}

/**
 * Transform OwnerRole from canister to frontend format
 */
export function transformOwnerRole(role: CanisterOwnerRole): OwnerRole {
  if ("SuperAdmin" in role) return "SuperAdmin";
  if ("Admin" in role) return "Admin";
  if ("Moderator" in role) return "Moderator";
  throw new Error(`Unknown owner role: ${JSON.stringify(role)}`);
}

/**
 * Transform Permission from canister to frontend format
 */
export function transformPermission(
  permission: CanisterPermission
): Permission {
  if ("SystemConfiguration" in permission) return "SystemConfiguration";
  if ("ManageUsers" in permission) return "ManageUsers";
  if ("ViewAnalytics" in permission) return "ViewAnalytics";
  if ("ModerateContent" in permission) return "ModerateContent";
  if ("ManageGroups" in permission) return "ManageGroups";
  if ("ManageOwners" in permission) return "ManageOwners";
  throw new Error(`Unknown permission: ${JSON.stringify(permission)}`);
}

/**
 * Transform Owner from canister to frontend format
 */
export function transformOwner(canisterOwner: CanisterOwner): Owner {
  return {
    principal: canisterOwner.principal.toString(),
    name: canisterOwner.name,
    role: transformOwnerRole(canisterOwner.role),
    permissions: canisterOwner.permissions.map(transformPermission),
    created_at: canisterOwner.created_at,
    created_by: canisterOwner.created_by.toString(),
  };
}

/**
 * Transform CanisterError to ApiError
 */
export function transformCanisterError(error: CanisterError): ApiError {
  return {
    code: error.code.toString(),
    message: error.message,
    error: error.error,
  };
}

/**
 * Handle Result<T, Error> types from canister responses
 */
export function handleCanisterResult<T, R>(
  result: { Ok: T } | { Err: CanisterError },
  transformer?: (data: T) => R
): R | T {
  if ("Ok" in result) {
    return transformer ? transformer(result.Ok) : result.Ok;
  } else {
    const apiError = transformCanisterError(result.Err);
    throw new Error(
      `API Error [${apiError.code}]: ${apiError.message} - ${apiError.error}`
    );
  }
}

/**
 * Convert string to Principal for canister calls
 */
export function stringToPrincipal(principalString: string): Principal {
  try {
    return Principal.fromText(principalString);
  } catch (error) {
    throw new Error(`Invalid Principal format: ${principalString}`);
  }
}

/**
 * Utility function to safely convert optional arrays from canister
 */
export function extractOptional<T>(optional: [] | [T]): T | undefined {
  return optional.length > 0 ? optional[0] : undefined;
}

/**
 * Utility function to create optional arrays for canister calls
 */
export function createOptional<T>(value: T | undefined): [] | [T] {
  return value !== undefined ? [value] : [];
}

/**
 * Format bigint timestamps to human-readable format
 */
export function formatTimestamp(timestamp: bigint): string {
  if (timestamp === 0n) return "Never";

  // Convert nanoseconds to milliseconds
  const milliseconds = Number(timestamp / 1_000_000n);
  const date = new Date(milliseconds);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Get time elapsed since timestamp
 */
export function getTimeElapsed(timestamp: bigint): string {
  if (timestamp === 0n) return "Never";

  const now = Date.now();
  const then = Number(timestamp / 1_000_000n);
  const diffMs = now - then;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days === 1 ? "" : "s"} ago`;
  if (hours > 0) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (minutes > 0) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  return `${seconds} second${seconds === 1 ? "" : "s"} ago`;
}

/**
 * Validate Principal string format
 */
export function isValidPrincipal(principalString: string): boolean {
  try {
    Principal.fromText(principalString);
    return true;
  } catch {
    return false;
  }
}

/**
 * Error wrapper for async operations with better error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context?: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const contextMessage = context ? `${context}: ` : "";

    // Handle specific error types
    if (errorMessage.includes("Unauthenticated")) {
      throw new Error(
        `${contextMessage}Authentication required. Please log in.`
      );
    }

    if (errorMessage.includes("Unauthorized")) {
      throw new Error(
        `${contextMessage}You don't have permission to perform this action.`
      );
    }

    if (errorMessage.includes("NotFound")) {
      throw new Error(`${contextMessage}The requested resource was not found.`);
    }

    if (errorMessage.includes("Network")) {
      throw new Error(
        `${contextMessage}Network error. Please check your connection.`
      );
    }

    // Re-throw with context if available
    throw new Error(`${contextMessage}${errorMessage}`);
  }
}
