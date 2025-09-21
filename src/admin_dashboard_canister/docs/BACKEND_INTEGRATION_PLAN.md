# Backend Integration Plan - Admin Dashboard

## Overview

This document outlines the integration plan for replacing mock implementations with real Internet Computer (IC) canister APIs in the Tal3a Admin Dashboard. The current system uses mock data for admin request management, and this plan details the steps to integrate with the owners canister backend.

## Current Architecture

### Frontend Stack

- **Framework**: React 18 with TypeScript
- **State Management**: TanStack Query for server state caching
- **Routing**: TanStack Router with file-based routing
- **UI Components**: Custom components with Tailwind CSS
- **Authentication**: Internet Identity integration via @dfinity/auth-client

### Backend Integration Points

- **Owners Canister**: Main backend canister for admin/owner management
- **Service Layer**: OwnersService singleton for canister communication
- **Hooks Layer**: TanStack Query hooks for data fetching and mutations

## API Integration Status

### ✅ Already Integrated (Working with Real APIs)

1. **Submit Admin Request**
   - Hook: `useSubmitAdminRequest`
   - Endpoint: `submit_admin_request(CreateAdminRequest)`
   - Status: ✅ Fully integrated with owners canister

2. **Get My Admin Request**
   - Hook: `useMyAdminRequest`
   - Endpoint: `get_my_admin_request()`
   - Status: ✅ Fully integrated with owners canister

3. **Process Admin Request**
   - Hook: `useProcessAdminRequest`
   - Endpoint: `process_admin_request(ProcessAdminRequest)`
   - Status: ✅ Fully integrated with owners canister

4. **Role Validation**
   - Hooks: `useIsOwner`, `useIsSuperAdmin`
   - Endpoints: `get_my_owner_info()`, `is_owner(Principal)`
   - Status: ✅ Fully integrated with owners canister

### 🔄 Needs Integration (Currently Mock)

#### 1. Get All Admin Requests

**Current Hook**: `useAllAdminRequests`

```typescript
// Current Mock Implementation
queryFn: async (): Promise<AdminRequest[]> => {
  // Mock implementation - will be replaced with actual API call
  return [];
};
```

**Required Integration**:

```typescript
queryFn: async (): Promise<AdminRequest[]> => {
  const ownerCanister =
    await OwnersService.getInstance().getOwnersCanisterActor();
  const result = await ownerCanister.get_all_admin_requests();

  if ("Ok" in result) {
    // Transform canister response to frontend types
    return result.Ok.map(transformAdminRequest);
  } else {
    throw new Error(result.Err.message);
  }
};
```

**API Available**: ✅ `get_all_admin_requests()` → `Result_1`

#### 2. Get Pending Admin Requests

**Current Hook**: `usePendingAdminRequests`

```typescript
// Current Mock Implementation
queryFn: async (): Promise<AdminRequest[]> => {
  // Mock implementation
  return [];
};
```

**Required Integration**:

```typescript
queryFn: async (): Promise<AdminRequest[]> => {
  const ownerCanister =
    await OwnersService.getInstance().getOwnersCanisterActor();
  const result = await ownerCanister.get_pending_admin_requests();

  if ("Ok" in result) {
    return result.Ok.map(transformAdminRequest);
  } else {
    throw new Error(result.Err.message);
  }
};
```

**API Available**: ✅ `get_pending_admin_requests()` → `Result_1`

## Data Type Mapping

### Canister Types → Frontend Types

#### AdminRequest Transformation

```typescript
// Canister Type (from .did file)
interface AdminRequest {
  id: string;
  status: AdminRequestStatus;
  name: string;
  requested_at: bigint;
  processed_at: [] | [bigint];
  processed_by: [] | [Principal];
  rejection_reason: [] | [string];
  requester_principal: Principal;
  reason: string;
}

// Frontend Type (current)
interface AdminRequest {
  id: string;
  requester_principal: string;
  name: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  requested_at: bigint;
  processed_at: bigint;
  processed_by?: string;
  rejection_reason?: string;
}
```

**Transformation Function Needed**:

```typescript
function transformAdminRequest(
  canisterRequest: CanisterAdminRequest
): FrontendAdminRequest {
  return {
    id: canisterRequest.id,
    requester_principal: canisterRequest.requester_principal.toString(),
    name: canisterRequest.name,
    reason: canisterRequest.reason,
    status: transformStatus(canisterRequest.status),
    requested_at: canisterRequest.requested_at,
    processed_at: canisterRequest.processed_at[0] || 0n,
    processed_by: canisterRequest.processed_by[0]?.toString(),
    rejection_reason: canisterRequest.rejection_reason[0],
  };
}

function transformStatus(
  status: AdminRequestStatus
): "Pending" | "Approved" | "Rejected" {
  if ("Pending" in status) return "Pending";
  if ("Approved" in status) return "Approved";
  if ("Rejected" in status) return "Rejected";
  throw new Error("Unknown status");
}
```

## Implementation Steps

### Phase 1: Data Type Harmonization

1. **Update Type Definitions**
   - Align frontend types with canister types
   - Create transformation utilities
   - Update all TypeScript interfaces

2. **Create Transformation Layer**
   - Implement `transformAdminRequest` function
   - Handle Optional types (`[] | [T]` → `T | undefined`)
   - Convert Principal to string representations

### Phase 2: Hook Integration

1. **Update `useAllAdminRequests`**
   - Replace mock implementation with real API call
   - Add error handling for Result types
   - Implement data transformation
   - Update loading and error states

2. **Update `usePendingAdminRequests`**
   - Replace mock implementation with real API call
   - Apply same patterns as above

### Phase 3: Error Handling Enhancement

1. **Standardize Error Types**

   ```typescript
   interface ApiError {
     code: number;
     message: string;
     error: string;
   }
   ```

2. **Implement Error Boundaries**
   - Add error handling in AdminRequestManager
   - Display user-friendly error messages
   - Implement retry mechanisms

### Phase 4: Testing & Validation

1. **Integration Testing**
   - Test all CRUD operations with real canister
   - Validate data transformations
   - Test error scenarios

2. **Performance Optimization**
   - Implement proper caching strategies
   - Add loading states and skeletons
   - Optimize re-fetching logic

## Files Requiring Changes

### Core Integration Files

```
src/hooks/useAdminRequest.ts          # Update hooks with real API calls
src/types/adminRequest.ts             # Align types with canister
src/services/owners.ts                # Enhance service methods
src/utilities/transformers.ts         # New: Data transformation utilities
```

### Component Updates

```
src/components/AdminRequestManager.tsx # Handle new error states
src/components/AdminRequestForm.tsx    # Update type handling
```

### Type Definition Updates

```
src/types/api.ts                      # New: Standardized API types
src/types/errors.ts                   # New: Error type definitions
```

## Configuration & Environment

### Canister Configuration

```typescript
// src/config/canisters.ts
export const CANISTER_IDS = {
  owners: process.env.CANISTER_ID_OWNERS_CANISTER,
  // Add other canister IDs as needed
};

export const IC_HOST =
  process.env.DFX_NETWORK === "local"
    ? "http://localhost:4943"
    : "https://ic0.app";
```

### Environment Variables Required

```env
# .env.local
CANISTER_ID_OWNERS_CANISTER=your_owners_canister_id
CANISTER_ID_INTERNET_IDENTITY=rdmx6-jaaaa-aaaaa-aaadq-cai
DFX_NETWORK=local  # or "ic" for mainnet
```

## Error Handling Strategy

### 1. Canister Error Types

```typescript
// Handle all Result<T, Error> types consistently
function handleCanisterResult<T>(result: Result<T, Error>): T {
  if ("Ok" in result) {
    return result.Ok;
  } else {
    throw new ApiError({
      code: result.Err.code,
      message: result.Err.message,
      error: result.Err.error,
    });
  }
}
```

### 2. Network Error Handling

```typescript
// Handle network and authentication errors
async function withErrorHandling<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (error.message.includes("Unauthenticated")) {
      // Redirect to login
      throw new AuthError("Please log in to continue");
    }
    if (error.message.includes("Network")) {
      throw new NetworkError("Please check your connection");
    }
    throw error;
  }
}
```

### 3. User-Friendly Error Messages

```typescript
const ERROR_MESSAGES = {
  NETWORK_ERROR: "Unable to connect to the service. Please try again.",
  AUTH_ERROR: "Please log in to access this feature.",
  PERMISSION_ERROR: "You don't have permission to perform this action.",
  VALIDATION_ERROR: "Please check your input and try again.",
  UNKNOWN_ERROR: "Something went wrong. Please try again later.",
};
```

## Testing Strategy

### 1. Unit Tests

- Test data transformation functions
- Test error handling logic
- Test hook behavior with mocked canister responses

### 2. Integration Tests

- Test full API integration with local canister
- Test authentication flows
- Test error scenarios

### 3. End-to-End Tests

- Test complete user workflows
- Test role-based access control
- Test bulk operations

## Performance Considerations

### 1. Caching Strategy

```typescript
// Implement smart caching with TanStack Query
const CACHE_TIMES = {
  adminRequests: 30 * 1000, // 30 seconds
  userProfile: 5 * 60 * 1000, // 5 minutes
  staticData: 60 * 60 * 1000, // 1 hour
};
```

### 2. Optimistic Updates

```typescript
// Implement optimistic updates for better UX
const useOptimisticProcessRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: processRequest,
    onMutate: async (variables) => {
      // Optimistically update the UI
      await queryClient.cancelQueries(["adminRequests"]);
      const previous = queryClient.getQueryData(["adminRequests"]);
      queryClient.setQueryData(["adminRequests"], (old) =>
        updateRequestOptimistically(old, variables)
      );
      return { previous };
    },
    onError: (err, variables, context) => {
      // Revert on error
      if (context?.previous) {
        queryClient.setQueryData(["adminRequests"], context.previous);
      }
    },
  });
};
```

## Security Considerations

### 1. Principal Validation

- Validate all Principal inputs
- Sanitize user inputs before sending to canister
- Implement proper access control checks

### 2. Authentication

- Ensure Internet Identity integration is secure
- Handle session expiration gracefully
- Implement proper logout functionality

### 3. Data Validation

- Validate all data received from canister
- Implement client-side validation for forms
- Handle malformed responses gracefully

## Deployment Checklist

### Pre-deployment

- [ ] All unit tests passing
- [ ] Integration tests with local canister passing
- [ ] Type checking with `tsc --noEmit` passes
- [ ] ESLint passes without errors
- [ ] Bundle size within acceptable limits

### Deployment Steps

1. Deploy updated canister with new APIs
2. Update frontend environment variables
3. Deploy frontend with new integration
4. Smoke test all functionality
5. Monitor for errors and performance issues

### Post-deployment

- [ ] Verify all API endpoints working
- [ ] Check error handling in production
- [ ] Monitor performance metrics
- [ ] Validate user workflows end-to-end

## Future Enhancements

### 1. Real-time Updates

- Implement WebSocket or polling for live updates
- Add notifications for status changes
- Implement collaborative editing features

### 2. Advanced Analytics

- Add comprehensive analytics dashboard
- Implement usage metrics and reporting
- Add audit logging for admin actions

### 3. Batch Operations

- Implement bulk approve/reject operations
- Add batch user management features
- Optimize for large datasets

This integration plan provides a comprehensive roadmap for connecting the Admin Dashboard frontend with the Internet Computer backend canisters, ensuring a robust, scalable, and user-friendly admin management system.
