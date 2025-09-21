export interface Owner {
  principal: string;
  name: string;
  role: OwnerRole;
  created_at: bigint;
  created_by: string;
  permissions: Permission[];
}

export enum OwnerRole {
  SuperAdmin = "SuperAdmin",
  Admin = "Admin",
  Moderator = "Moderator",
}

export enum Permission {
  ManageOwners = "ManageOwners",
  ManageGroups = "ManageGroups",
  ManageUsers = "ManageUsers",
  ModerateContent = "ModerateContent",
  ViewAnalytics = "ViewAnalytics",
  SystemConfiguration = "SystemConfiguration",
}

export interface AdminRequest {
  id: string;
  requester_principal: string;
  name: string;
  reason: string;
  status: AdminRequestStatus;
  requested_at: bigint;
  processed_at?: bigint;
  processed_by?: string;
  rejection_reason?: string;
}

export enum AdminRequestStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
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

export interface GroupAdmin {
  principal: string;
  name: string;
  group_id: string;
  permissions: GroupPermission[];
  created_at: bigint;
  created_by: string;
}

export enum GroupPermission {
  ManageMembers = "ManageMembers",
  ModerateContent = "ModerateContent",
  ManageEvents = "ManageEvents",
  ConfigureGroup = "ConfigureGroup",
  ViewGroupAnalytics = "ViewGroupAnalytics",
}

export interface AuthUser {
  principal: string;
  isAuthenticated: boolean;
  isOwner: boolean;
  isAdmin: boolean;
  role?: OwnerRole;
  permissions: Permission[];
}

export interface NotificationData {
  id: string;
  type:
    | "admin_request"
    | "system_alert"
    | "token_transfer"
    | "permission_change";
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  data?: any;
}
