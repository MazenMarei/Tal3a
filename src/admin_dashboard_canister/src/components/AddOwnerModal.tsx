/**
 * Add Owner Modal Component
 *
 * Modal for adding new platform owners with role and permission validation
 */

import React, { useState, useEffect } from "react";
import { Principal } from "@dfinity/principal";
import { useAddOwner } from "../hooks/useOwnerManagement";
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
  User,
  Shield,
  Crown,
  UserCheck,
  Check,
  AlertCircle,
} from "lucide-react";

// Types
interface AddOwnerFormData {
  principal: string;
  name: string;
  role: "SuperAdmin" | "Admin" | "Moderator";
  permissions: string[];
}

interface AddOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  preFilledData?: {
    principal?: string;
    name?: string;
  };
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

export const AddOwnerModal: React.FC<AddOwnerModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  preFilledData,
}) => {
  const [formData, setFormData] = useState<AddOwnerFormData>({
    principal: "",
    name: "",
    role: "Admin",
    permissions: ROLE_CONFIGS.Admin.defaultPermissions,
  });

  const [errors, setErrors] = useState<Partial<AddOwnerFormData>>({});
  const [principalError, setPrincipalError] = useState<string>("");

  // Add owner mutation
  const addOwnerMutation = useAddOwner();

  // Reset form when modal opens or pre-filled data changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        principal: preFilledData?.principal || "",
        name: preFilledData?.name || "",
        role: "Admin",
        permissions: ROLE_CONFIGS.Admin.defaultPermissions,
      });
      setErrors({});
      setPrincipalError("");
    }
  }, [isOpen, preFilledData]);

  // Update permissions when role changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      permissions: ROLE_CONFIGS[prev.role].defaultPermissions,
    }));
  }, [formData.role]);

  const validatePrincipal = (principal: string): string => {
    if (!principal.trim()) {
      return "Principal ID is required";
    }

    try {
      Principal.fromText(principal.trim());
      return "";
    } catch (error) {
      return "Invalid principal ID format";
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<AddOwnerFormData> = {};

    // Validate principal
    const principalValidation = validatePrincipal(formData.principal);
    if (principalValidation) {
      setPrincipalError(principalValidation);
      return false;
    } else {
      setPrincipalError("");
    }

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

    if (!validateForm()) {
      return;
    }

    addOwnerMutation.mutate(
      {
        ...formData,
        principal: formData.principal.trim(),
        name: formData.name.trim(),
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
    if (!addOwnerMutation.isPending) {
      onClose();
    }
  };

  const handleRoleChange = (role: "SuperAdmin" | "Admin" | "Moderator") => {
    setFormData((prev) => ({
      ...prev,
      role,
      permissions: ROLE_CONFIGS[role].defaultPermissions,
    }));
  };

  const handlePermissionToggle = (permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((p) => p !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  if (!isOpen) return null;

  const roleConfig = ROLE_CONFIGS[formData.role];
  const RoleIcon = roleConfig.icon;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Add New Owner
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={addOwnerMutation.isPending}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Principal ID Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Principal ID *
              </label>
              <Input
                type="text"
                value={formData.principal}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    principal: e.target.value,
                  }))
                }
                placeholder="Enter principal ID (e.g., rdmx6-jaaaa-aaaah-qcaiq-cai)"
                className={principalError ? "border-red-300" : ""}
                disabled={addOwnerMutation.isPending}
              />
              {principalError && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {principalError}
                </p>
              )}
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter owner's name"
                className={errors.name ? "border-red-300" : ""}
                disabled={addOwnerMutation.isPending}
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Role *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(
                  Object.keys(ROLE_CONFIGS) as Array<keyof typeof ROLE_CONFIGS>
                ).map((role) => {
                  const config = ROLE_CONFIGS[role];
                  const Icon = config.icon;
                  const isSelected = formData.role === role;

                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRoleChange(role)}
                      disabled={addOwnerMutation.isPending}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        isSelected
                          ? `${config.bgColor} ${config.borderColor} ${config.color}`
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon
                          className={`h-4 w-4 ${isSelected ? config.color : "text-gray-400"}`}
                        />
                        <span
                          className={`font-medium ${isSelected ? config.color : "text-gray-700"}`}
                        >
                          {role}
                        </span>
                        {isSelected && (
                          <Check
                            className={`h-4 w-4 ${config.color} ml-auto`}
                          />
                        )}
                      </div>
                      <p
                        className={`text-xs ${isSelected ? config.color : "text-gray-500"}`}
                      >
                        {config.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Permissions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Permissions
              </label>
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
                          disabled={addOwnerMutation.isPending}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {permission.label}
                            </span>
                            {isDefaultForRole && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                Default
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
                  {errors.permissions}
                </p>
              )}
            </div>

            {/* Error Display */}
            {addOwnerMutation.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {addOwnerMutation.error instanceof Error
                    ? addOwnerMutation.error.message
                    : "Failed to add owner"}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={addOwnerMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addOwnerMutation.isPending}
                className="min-w-[120px]"
              >
                {addOwnerMutation.isPending ? (
                  <>
                    <LoadingSpinner />
                    <span className="ml-2">Adding...</span>
                  </>
                ) : (
                  <>
                    <RoleIcon className="h-4 w-4 mr-2" />
                    Add Owner
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
