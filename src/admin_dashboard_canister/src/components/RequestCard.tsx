/**
 * RequestCard Component
 *
 * Individual card component for displaying admin request details with action buttons
 */

import React from "react";
import type { AdminRequest } from "../types/adminRequest";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  MessageSquare,
  Shield,
  Copy,
} from "lucide-react";
import { cn } from "../lib/utils";

interface RequestCardProps {
  request: AdminRequest;
  onProcessRequest?: (
    request: AdminRequest,
    action: "approve" | "reject"
  ) => void;
  showActions: boolean;
  className?: string;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onProcessRequest,
  showActions,
  className,
}) => {
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

  const getStatusBadge = () => {
    switch (request.status) {
      case "Pending":
        return (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </div>
        );
      case "Approved":
        return (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </div>
        );
      case "Rejected":
        return (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
            Unknown
          </div>
        );
    }
  };

  const copyPrincipal = () => {
    navigator.clipboard.writeText(request.requester_principal);
    // Simple notification - can be enhanced later
    console.log("Principal ID copied to clipboard");
  };

  const truncatePrincipal = (principal: string) => {
    if (principal.length <= 20) return principal;
    return `${principal.slice(0, 10)}...${principal.slice(-10)}`;
  };

  return (
    <Card className={cn("transition-all hover:shadow-md", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              {request.name}
            </CardTitle>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                <span className="font-mono text-xs">
                  {truncatePrincipal(request.requester_principal)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={copyPrincipal}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(request.requested_at)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">{getStatusBadge()}</div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Request Reason */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-4 w-4 text-gray-600" />
            <span className="font-medium text-sm">Request Reason</span>
          </div>
          <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md border">
            {request.reason}
          </p>
        </div>

        {/* Processing Information */}
        {request.status !== "Pending" && (
          <div className="mb-4 p-3 rounded-md border bg-gray-50">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                {request.status === "Approved" ? "Approved" : "Rejected"}
              </span>
              {request.processed_at && request.processed_at !== 0n ? (
                <span className="text-muted-foreground">
                  {formatDate(request.processed_at)}
                </span>
              ) : null}
            </div>
            {request.processed_by && (
              <div className="text-xs text-muted-foreground mt-1">
                By: {truncatePrincipal(request.processed_by)}
              </div>
            )}
            {request.rejection_reason && (
              <div className="mt-2">
                <span className="text-xs font-medium text-red-700">
                  Rejection Reason:
                </span>
                <p className="text-xs text-red-600 mt-1">
                  {request.rejection_reason}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {showActions && request.status === "Pending" && onProcessRequest && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
              onClick={() => onProcessRequest(request, "approve")}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => onProcessRequest(request, "reject")}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </div>
        )}

        {/* Request ID (for debugging) */}
        <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
          Request ID: <span className="font-mono">{request.id}</span>
        </div>
      </CardContent>
    </Card>
  );
};
