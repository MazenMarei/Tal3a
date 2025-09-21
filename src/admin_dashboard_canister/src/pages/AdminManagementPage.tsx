/**
 * Admin Management Page
 *
 * Interface for managing owners, roles, and permissions
 */

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useIsSuperAdmin } from "../hooks/useRoles";
import { getOwnersActor } from "../../../frontend_canister/src/services/owners";
import { transformOwner, withErrorHandling } from "../utilities/transformers";
import { useRemoveOwner } from "../hooks/useOwnerManagement";
import { AddOwnerModal } from "../components/AddOwnerModal";
import { EditOwnerModal } from "../components/EditOwnerModal";
import { RemoveOwnerModal } from "../components/RemoveOwnerModal";
import { useToast } from "../components/Toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { LoadingSpinner } from "../components/LoadingSpinner";
import {
  Shield,
  Users,
  UserPlus,
  Edit,
  Trash2,
  Crown,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import type { Owner } from "../types/api";

const ROLE_COLORS = {
  SuperAdmin: "bg-red-100 text-red-800 border-red-200",
  Admin: "bg-blue-100 text-blue-800 border-blue-200",
  Moderator: "bg-green-100 text-green-800 border-green-200",
};

const ROLE_ICONS = {
  SuperAdmin: Crown,
  Admin: Shield,
  Moderator: UserCheck,
};

export const AdminManagementPage: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [ownerToRemove, setOwnerToRemove] = useState<Owner | null>(null);

  const { isSuperAdmin, isLoading: checkingRole } = useIsSuperAdmin();
  const removeOwnerMutation = useRemoveOwner();
  const { success: showSuccess } = useToast();

  // Fetch all owners
  const {
    data: owners,
    isLoading: loadingOwners,
    error,
  } = useQuery({
    queryKey: ["owners", "all"],
    queryFn: async (): Promise<Owner[]> => {
      return withErrorHandling(async () => {
        const actor = await getOwnersActor();
        if (!actor)
          throw new Error("Failed to initialize owners canister actor");

        const result = await actor.get_all_owners();
        if ("Ok" in result) {
          return result.Ok.map(transformOwner);
        } else {
          throw new Error(`API Error: ${result.Err.message}`);
        }
      }, "Fetching owners");
    },
    enabled: isSuperAdmin,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Access control
  if (checkingRole) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isSuperAdmin) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Access Restricted
          </h2>
          <p className="text-gray-600">
            Only Super Admins can access the Admin Management page.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleRemoveOwner = (owner: Owner) => {
    setOwnerToRemove(owner);
    setShowRemoveModal(true);
  };

  const confirmRemoveOwner = () => {
    if (ownerToRemove) {
      removeOwnerMutation.mutate(ownerToRemove.principal, {
        onSuccess: () => {
          setShowRemoveModal(false);
          setOwnerToRemove(null);
          showSuccess(
            "Owner Removed",
            `${ownerToRemove.name} has been successfully removed from the platform.`
          );
        },
        onError: (error) => {
          // Keep modal open to show error in modal instead of toast
          console.log("Remove owner error:", error);
        },
      });
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp / 1_000_000n));
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
          <p className="text-gray-600 mt-2">
            Manage platform owners, roles, and permissions
          </p>
        </div>
        {isSuperAdmin && (
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Owner
          </Button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Crown className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Super Admins
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {owners?.filter((o) => o.role === "SuperAdmin").length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-gray-900">
                  {owners?.filter((o) => o.role === "Admin").length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Moderators</p>
                <p className="text-2xl font-bold text-gray-900">
                  {owners?.filter((o) => o.role === "Moderator").length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Owners
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {owners?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Owners List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Platform Owners
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingOwners ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              Failed to load owners: {error.message}
            </div>
          ) : !owners?.length ? (
            <div className="text-center py-8 text-gray-500">
              No owners found.
            </div>
          ) : (
            <div className="space-y-4">
              {owners.map((owner) => {
                const RoleIcon = ROLE_ICONS[owner.role];

                return (
                  <div
                    key={owner.principal}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <RoleIcon className="h-6 w-6 text-gray-600" />
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {owner.name}
                        </h3>
                        <p className="text-sm text-gray-500 font-mono">
                          {owner.principal.slice(0, 20)}...
                        </p>
                        <p className="text-xs text-gray-400">
                          Created: {formatTimestamp(owner.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${ROLE_COLORS[owner.role]}`}
                      >
                        <RoleIcon className="h-3 w-3 mr-1" />
                        {owner.role}
                      </span>

                      {isSuperAdmin && (
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedOwner(owner);
                              setShowEditModal(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveOwner(owner)}
                            disabled={removeOwnerMutation.isPending}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Permissions Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Role</th>
                  <th className="text-center py-2">System Config</th>
                  <th className="text-center py-2">Manage Users</th>
                  <th className="text-center py-2">View Analytics</th>
                  <th className="text-center py-2">Moderate Content</th>
                  <th className="text-center py-2">Manage Groups</th>
                  <th className="text-center py-2">Manage Owners</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium">Super Admin</td>
                  <td className="text-center py-2">✅</td>
                  <td className="text-center py-2">✅</td>
                  <td className="text-center py-2">✅</td>
                  <td className="text-center py-2">✅</td>
                  <td className="text-center py-2">✅</td>
                  <td className="text-center py-2">✅</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Admin</td>
                  <td className="text-center py-2">❌</td>
                  <td className="text-center py-2">✅</td>
                  <td className="text-center py-2">✅</td>
                  <td className="text-center py-2">✅</td>
                  <td className="text-center py-2">✅</td>
                  <td className="text-center py-2">❌</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Moderator</td>
                  <td className="text-center py-2">❌</td>
                  <td className="text-center py-2">❌</td>
                  <td className="text-center py-2">✅</td>
                  <td className="text-center py-2">✅</td>
                  <td className="text-center py-2">❌</td>
                  <td className="text-center py-2">❌</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Owner Modal */}
      <AddOwnerModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false);
          showSuccess(
            "Owner Added",
            "New owner has been successfully added to the platform."
          );
        }}
      />

      {/* Edit Owner Modal */}
      <EditOwnerModal
        owner={selectedOwner}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedOwner(null);
        }}
        onSuccess={() => {
          setShowEditModal(false);
          setSelectedOwner(null);
          showSuccess(
            "Owner Updated",
            "Owner permissions have been successfully updated."
          );
        }}
      />

      {/* Remove Owner Modal */}
      <RemoveOwnerModal
        owner={ownerToRemove}
        isOpen={showRemoveModal}
        onClose={() => {
          setShowRemoveModal(false);
          setOwnerToRemove(null);
          removeOwnerMutation.reset(); // Clear any previous errors
        }}
        onConfirm={confirmRemoveOwner}
        isRemoving={removeOwnerMutation.isPending}
        error={removeOwnerMutation.error}
      />
    </div>
  );
};

export default AdminManagementPage;
