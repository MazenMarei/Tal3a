/**
 * Edit Owner Modal Component
 *
 * Modal for editing existing platform owners with role and permission validation
 */

import React, { useState, useEffect } from "react";
import { useUpdateOwnerPermissions } from "../hooks/useOwnerManagement";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { LoadingSpinner } from "../components/LoadingSpinner";
import {
  X,
  Shield,
  Crown,
  UserCheck,
  Check,
  AlertCircle,
  Edit,
} from "lucide-react";
import type { Owner } from "../types/api";

// Types
interface EditOwnerFormData {
  name: string;
  role: "SuperAdmin" | "Admin" | "Moderator";
  permissions: string[];
}

interface EditOwnerModalProps {
  owner: Owner | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Role configurations with default permissions
const ROLE_CONFIGS = {
  SuperAdmin: {
    icon: Crown,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    description: "Full platform access including owner management",
    defaultPermissions: [
      "ManageOwners",
      "ManageGroups",
      "ManageUsers",
      "ModerateContent",
      "ViewAnalytics",
      "SystemConfiguration",
    ],
  },
  Admin: {
    icon: Shield,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description: "Administrative access to groups and users",
    defaultPermissions: [
      "ManageGroups",
      "ManageUsers",
      "ModerateContent",
      "ViewAnalytics",
    ],
  },
  Moderator: {
    icon: UserCheck,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    description: "Content moderation and basic analytics",
    defaultPermissions: ["ModerateContent", "ViewAnalytics"],
  },
};

const ALL_PERMISSIONS = [
  {
    id: "ManageOwners",
    label: "Manage Owners",
    description: "Add, remove, and modify platform owners",
  },
  {
    id: "ManageGroups",
    label: "Manage Groups",
    description: "Create, delete, and configure groups",
  },
  {
    id: "ManageUsers",
    label: "Manage Users",
    description: "Manage user accounts and profiles",
  },
  {
    id: "ModerateContent",
    label: "Moderate Content",
    description: "Review and moderate posts and events",
  },
  {
    id: "ViewAnalytics",
    label: "View Analytics",
    description: "Access platform statistics and insights",
  },
  {
    id: "SystemConfiguration",
    label: "System Configuration",
    description: "Configure system-wide settings",
  },
];

export const EditOwnerModal: React.FC<EditOwnerModalProps> = ({
  owner,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<EditOwnerFormData>({
    name: "",
    role: "Admin",
    permissions: [],
  });

  const [errors, setErrors] = useState<Partial<EditOwnerFormData>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Update permissions mutation (we can only update permissions, not name or role)
  const updatePermissionsMutation = useUpdateOwnerPermissions();

  // Initialize form data when modal opens or owner changes
  useEffect(() => {
    if (isOpen && owner) {
      const ownerRole = owner.role as "SuperAdmin" | "Admin" | "Moderator";
      const ownerPermissions = owner.permissions || [];

      setFormData({
        name: owner.name,
        role: ownerRole,
        permissions: ownerPermissions,
      });
      setErrors({});
      setHasChanges(false);
    }
  }, [isOpen, owner]);

  // Check for changes
  useEffect(() => {
    if (!owner) return;

    const originalPermissions = (owner.permissions || []).map(String);
    const currentPermissions = formData.permissions.map(String);
    const hasPermissionChanges =
      currentPermissions.length !== originalPermissions.length ||
      currentPermissions.some((p) => !originalPermissions.includes(p)) ||
      originalPermissions.some((p) => !currentPermissions.includes(p));

    setHasChanges(hasPermissionChanges);
  }, [formData.permissions, owner]);

  const validateForm = (): boolean => {
    const newErrors: Partial<EditOwnerFormData> = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Validate permissions
    if (formData.permissions.length === 0) {
      newErrors.permissions = ["At least one permission is required"];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!owner || !validateForm() || !hasChanges) {
      return;
    }

    // Currently we can only update permissions via the canister
    updatePermissionsMutation.mutate(
      {
        principal: owner.principal,
        permissions: formData.permissions,
      },
      {
        onSuccess: () => {
          onSuccess?.();
          handleClose();
        },
      }
    );
  };

  const handleClose = () => {
    if (!updatePermissionsMutation.isPending) {
      onClose();
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((p) => p !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  if (!isOpen || !owner) return null;

  const roleConfig = ROLE_CONFIGS[formData.role];
  const RoleIcon = roleConfig.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full bg-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Owner: {owner.name}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={updatePermissionsMutation.isPending}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Principal ID Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Principal ID
              </label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                <code className="text-sm text-gray-700 break-all">
                  {owner.principal}
                </code>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Principal ID cannot be changed
              </p>
            </div>

            {/* Name Display (Read-only for now) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter owner's name"
                className={errors.name ? "border-red-300" : "bg-gray-50"}
                disabled={true} // Currently disabled as backend doesn't support name updates
              />
              <p className="text-xs text-gray-500 mt-1">
                Name editing will be available in a future update
              </p>
              {errors.name && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Role Display (Read-only for now) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Current Role
              </label>
              <div
                className={`p-3 border rounded-lg ${roleConfig.bgColor} ${roleConfig.borderColor}`}
              >
                <div className="flex items-center gap-2">
                  <RoleIcon className={`h-5 w-5 ${roleConfig.color}`} />
                  <span className={`font-medium ${roleConfig.color}`}>
                    {formData.role}
                  </span>
                </div>
                <p className={`text-sm ${roleConfig.color} mt-1`}>
                  {roleConfig.description}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Role changes require canister upgrade
              </p>
            </div>

            {/* Permissions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Permissions
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      permissions: ROLE_CONFIGS[prev.role].defaultPermissions,
                    }))
                  }
                  disabled={updatePermissionsMutation.isPending}
                >
                  Reset to Role Defaults
                </Button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {ALL_PERMISSIONS.map((permission) => {
                  const isChecked = formData.permissions.includes(
                    permission.id
                  );
                  const isDefaultForRole =
                    roleConfig.defaultPermissions.includes(permission.id);

                  return (
                    <div
                      key={permission.id}
                      className={`p-3 border rounded-lg ${
                        isDefaultForRole
                          ? "bg-gray-50 border-gray-200"
                          : "border-gray-100"
                      }`}
                    >
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handlePermissionToggle(permission.id)}
                          disabled={updatePermissionsMutation.isPending}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {permission.label}
                            </span>
                            {isDefaultForRole && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                Default for {formData.role}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {permission.description}
                          </p>
                        </div>
                      </label>
                    </div>
                  );
                })}
              </div>
              {errors.permissions && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {Array.isArray(errors.permissions)
                    ? errors.permissions[0]
                    : errors.permissions}
                </p>
              )}
            </div>

            {/* Changes Indicator */}
            {hasChanges && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700 text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  You have unsaved permission changes
                </p>
              </div>
            )}

            {/* Error Display */}
            {updatePermissionsMutation.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {updatePermissionsMutation.error instanceof Error
                    ? updatePermissionsMutation.error.message
                    : "Failed to update owner permissions"}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={updatePermissionsMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updatePermissionsMutation.isPending || !hasChanges}
                className="min-w-[140px]"
              >
                {updatePermissionsMutation.isPending ? (
                  <>
                    <LoadingSpinner />
                    <span className="ml-2">Updating...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Update Permissions
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
