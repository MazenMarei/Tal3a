/**
 * ProcessRequestModal Component
 *
 * Modal for approving or rejecting admin requests with optional rejection reason
 */

import React, { useState, useEffect } from "react";
import type { AdminRequest } from "../types/adminRequest";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  CheckCircle,
  XCircle,
  User,
  MessageSquare,
  AlertTriangle,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "../lib/utils";

interface ProcessRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: AdminRequest;
  action: "approve" | "reject";
  onProcess: (params: {
    request_id: string;
    action: "approve" | "reject";
    rejection_reason?: string;
  }) => Promise<void>;
  isProcessing: boolean;
  error?: Error | null;
}

export const ProcessRequestModal: React.FC<ProcessRequestModalProps> = ({
  isOpen,
  onClose,
  request,
  action,
  onProcess,
  isProcessing,
  error,
}) => {
  const [rejectionReason, setRejectionReason] = useState("");

  // Reset form when modal opens/closes or action changes
  useEffect(() => {
    if (!isOpen) {
      setRejectionReason("");
    }
  }, [isOpen, action]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation for rejection
    if (action === "reject" && rejectionReason.trim().length < 10) {
      return;
    }

    try {
      await onProcess({
        request_id: request.id,
        action,
        rejection_reason:
          action === "reject" ? rejectionReason.trim() : undefined,
      });
      onClose();
    } catch (error) {
      // Error handling is done by the parent component
    }
  };

  const formatDate = (timestamp: bigint) => {
    try {
      const milliseconds = Number(timestamp / 1_000_000n);
      return new Date(milliseconds).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  const truncatePrincipal = (principal: string) => {
    if (principal.length <= 20) return principal;
    return `${principal.slice(0, 10)}...${principal.slice(-10)}`;
  };

  if (!isOpen) return null;

  const isReject = action === "reject";
  const canSubmit =
    !isProcessing && (isReject ? rejectionReason.trim().length >= 10 : true);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                {isReject ? (
                  <>
                    <XCircle className="h-6 w-6 text-red-600" />
                    Reject Admin Request
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    Approve Admin Request
                  </>
                )}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                disabled={isProcessing}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {/* Request Details */}
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Request Details
              </h3>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Requester:</span> {request.name}
                </div>
                <div>
                  <span className="font-medium">Principal:</span>
                  <span className="font-mono text-xs ml-1">
                    {truncatePrincipal(request.requester_principal)}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Requested:</span>{" "}
                  {formatDate(request.requested_at)}
                </div>
                <div>
                  <span className="font-medium">Request ID:</span>
                  <span className="font-mono text-xs ml-1">{request.id}</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="font-medium text-sm">
                    Reason for Admin Access:
                  </span>
                </div>
                <p className="text-sm bg-white p-3 rounded border">
                  {request.reason}
                </p>
              </div>
            </div>

            {/* Action-specific content */}
            {isReject ? (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4 text-amber-600">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">
                    Rejection requires a reason
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="rejection-reason"
                      className="block text-sm font-medium mb-2"
                    >
                      Reason for Rejection *
                    </label>
                    <textarea
                      id="rejection-reason"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full p-3 border rounded-md resize-none"
                      rows={4}
                      placeholder="Please provide a clear reason for rejecting this admin request (minimum 10 characters)..."
                      disabled={isProcessing}
                      required
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {rejectionReason.length}/10 characters minimum
                    </div>
                    {rejectionReason.length > 0 &&
                      rejectionReason.length < 10 && (
                        <div className="text-xs text-red-600 mt-1">
                          Rejection reason must be at least 10 characters long
                        </div>
                      )}
                  </div>
                </form>
              </div>
            ) : (
              <div className="mb-6 p-4 border rounded-lg bg-green-50 border-green-200">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Confirm Approval</span>
                </div>
                <p className="text-sm text-green-600 mt-2">
                  This user will be granted admin access to the platform. They
                  will be able to manage users, moderate content, and access
                  admin features.
                </p>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 border border-red-200 rounded-lg bg-red-50">
                <div className="flex items-center gap-2 text-red-700 mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Processing Failed</span>
                </div>
                <p className="text-sm text-red-600">
                  {error.message ||
                    "An unexpected error occurred while processing the request."}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={cn(
                  "min-w-[120px]",
                  isReject
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                )}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="ml-2">Processing...</span>
                  </>
                ) : (
                  <>
                    {isReject ? (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        {error ? "Retry Rejection" : "Reject Request"}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {error ? "Retry Approval" : "Approve Request"}
                      </>
                    )}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
