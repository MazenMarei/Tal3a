// Types matching the owners_canister Rust types
export interface AdminRequest {
  id: string;
  requester_principal: string;
  name: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requested_at: bigint;
  processed_at?: bigint;
  processed_by?: string;
  rejection_reason?: string;
}

export interface CreateAdminRequest {
  name: string;
  reason: string;
}

export interface ProcessAdminRequest {
  request_id: string;
  approve: boolean;
  rejection_reason?: string;
}

export type AdminRequestStatus = 'Pending' | 'Approved' | 'Rejected';