/**
 * Remove Owner Confirmation Modal
 *
 * Confirmation dialog for removing platform owners with safety checks
 */

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { LoadingSpinner } from "../components/LoadingSpinner";
import {
  X,
  AlertTriangle,
  Trash2,
  Shield,
  Crown,
  UserCheck,
} from "lucide-react";
import type { Owner } from "../types/api";

interface RemoveOwnerModalProps {
  owner: Owner | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isRemoving?: boolean;
  error?: Error | null;
}

const ROLE_ICONS = {
  SuperAdmin: Crown,
  Admin: Shield,
  Moderator: UserCheck,
};

const ROLE_COLORS = {
  SuperAdmin: "text-red-600",
  Admin: "text-blue-600",
  Moderator: "text-green-600",
};

export const RemoveOwnerModal: React.FC<RemoveOwnerModalProps> = ({
  owner,
  isOpen,
  onClose,
  onConfirm,
  isRemoving = false,
  error = null,
}) => {
  if (!isOpen || !owner) return null;

  const RoleIcon = ROLE_ICONS[owner.role as keyof typeof ROLE_ICONS];
  const roleColor = ROLE_COLORS[owner.role as keyof typeof ROLE_COLORS];

  const isSuperAdmin = owner.role === "SuperAdmin";

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full bg-white max-w-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Remove Owner
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isRemoving}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Warning Message */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-red-800 mb-1">
                  {isSuperAdmin ? "Remove Super Admin" : "Remove Owner"}
                </h4>
                <p className="text-sm text-red-700">
                  {isSuperAdmin
                    ? "You are about to remove a Super Admin. This action cannot be undone and will permanently revoke all administrative privileges."
                    : "You are about to remove this owner. This action cannot be undone and will permanently revoke their access to the platform."}
                </p>
              </div>
            </div>
          </div>

          {/* Owner Details */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-3">Owner Details</h5>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Name:</span>
                <span className="font-medium text-gray-900">{owner.name}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Role:</span>
                <div className="flex items-center gap-2">
                  <RoleIcon className={`h-4 w-4 ${roleColor}`} />
                  <span className={`font-medium ${roleColor}`}>
                    {owner.role}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-600">Principal:</span>
                <code className="text-xs bg-white px-2 py-1 rounded border max-w-[300px] break-all">
                  {owner.principal}
                </code>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-600">Permissions:</span>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">
                    {(owner.permissions || []).length} permission
                    {(owner.permissions || []).length === 1 ? "" : "s"}
                  </span>
                  {(owner.permissions || []).length > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      {(owner.permissions || []).slice(0, 2).join(", ")}
                      {(owner.permissions || []).length > 2 && (
                        <span>
                          {" "}
                          +{(owner.permissions || []).length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Super Admin Warning */}
          {isSuperAdmin && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Crown className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h5 className="font-medium text-yellow-800 mb-1">
                    Super Admin Removal
                  </h5>
                  <p className="text-sm text-yellow-700">
                    Removing a Super Admin will revoke their ability to manage
                    owners, system configuration, and other critical platform
                    functions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Input */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">
              To confirm removal, type the owner's name exactly as shown:
            </p>
            <p className="font-mono text-sm bg-gray-100 p-2 rounded border">
              {owner.name}
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h5 className="font-medium text-red-800 mb-1">
                    Cannot Remove Owner
                  </h5>
                  <p className="text-sm text-red-700">
                    {(() => {
                      const errorMsg = error.message || "";
                      if (
                        errorMsg.includes(
                          "Cannot remove the absolute super admin"
                        )
                      ) {
                        return "This is the absolute Super Admin and cannot be removed. At least one Super Admin must remain to manage the platform.";
                      }
                      if (errorMsg.includes("super admin")) {
                        return "Super Admins have special protection and may require additional authorization to remove.";
                      }
                      return (
                        errorMsg ||
                        "An unexpected error occurred while removing the owner."
                      );
                    })()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isRemoving}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={isRemoving}
              className="min-w-[120px]"
            >
              {isRemoving ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Removing...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {error ? "Try Again" : "Remove Owner"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
