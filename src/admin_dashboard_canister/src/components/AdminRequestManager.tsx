import React, { useState } from "react";
import {
  useAllAdminRequests,
  usePendingAdminRequests,
  useProcessAdminRequest,
  useDeleteAdminRequest,
} from "../hooks/useAdminRequests";
import { useIsSuperAdmin } from "../hooks/useRoles";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { LoadingSpinner } from "./ui/loading-spinner";
import { AddOwnerModal } from "./AddOwnerModal";
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  MessageSquare,
  Shield,
  Copy,
  UserPlus,
  Trash2,
} from "lucide-react";
import type { AdminRequest } from "../types/adminRequest";

type TabType = "pending" | "all" | "approved" | "rejected";

export const AdminRequestManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [selectedRequests, setSelectedRequests] = useState<Set<string>>(
    new Set()
  );
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState<string>("");
  const [showAddOwnerModal, setShowAddOwnerModal] = useState(false);
  const [preFilledOwnerData, setPreFilledOwnerData] = useState<{
    principal: string;
    name: string;
  } | null>(null);

  const { isSuperAdmin, isLoading: isCheckingRole } = useIsSuperAdmin();
  const {
    data: allRequests,
    isLoading: isLoadingAll,
    refetch: refetchAll,
  } = useAllAdminRequests();
  const { isLoading: isLoadingPending, refetch: refetchPending } =
    usePendingAdminRequests();
  const processRequest = useProcessAdminRequest();
  const deleteRequest = useDeleteAdminRequest();

  // Access control - only super admins can access this component
  if (isCheckingRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600">
              You don't have permission to access this page. Only Super Admins
              can manage admin requests.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getFilteredRequests = (): AdminRequest[] => {
    if (!allRequests) return [];

    switch (activeTab) {
      case "pending":
        return allRequests.filter((req) => req.status === "Pending");
      case "approved":
        return allRequests.filter((req) => req.status === "Approved");
      case "rejected":
        return allRequests.filter((req) => req.status === "Rejected");
      case "all":
      default:
        return allRequests;
    }
  };

  const handleSelectRequest = (requestId: string) => {
    const newSelection = new Set(selectedRequests);
    if (newSelection.has(requestId)) {
      newSelection.delete(requestId);
    } else {
      newSelection.add(requestId);
    }
    setSelectedRequests(newSelection);
  };

  const handleSelectAll = () => {
    const requests = getFilteredRequests();
    const pendingRequests = requests.filter((req) => req.status === "Pending");

    if (selectedRequests.size === pendingRequests.length) {
      setSelectedRequests(new Set());
    } else {
      setSelectedRequests(new Set(pendingRequests.map((req) => req.id)));
    }
  };

  const handleBulkAction = async (approve: boolean) => {
    const promises = Array.from(selectedRequests).map((requestId) =>
      processRequest.mutateAsync({
        request_id: requestId,
        action: approve ? "approve" : "reject",
        rejection_reason: approve ? undefined : "Bulk rejection",
      })
    );

    try {
      await Promise.all(promises);
      setSelectedRequests(new Set());
      refetchAll();
      refetchPending();
    } catch (error) {
      console.error("Bulk action failed:", error);
    }
  };

  const handleSingleAction = async (
    requestId: string,
    approve: boolean,
    reason?: string
  ) => {
    try {
      await processRequest.mutateAsync({
        request_id: requestId,
        action: approve ? "approve" : "reject",
        rejection_reason: reason,
      });
      refetchAll();
      refetchPending();
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  const handleRejectWithReason = async () => {
    if (currentRequestId && rejectionReason.trim()) {
      await handleSingleAction(currentRequestId, false, rejectionReason);
      setShowRejectModal(false);
      setRejectionReason("");
      setCurrentRequestId("");
    }
  };

  // Copy principal to clipboard
  const handleCopyPrincipal = async (principal: string) => {
    try {
      await navigator.clipboard.writeText(principal);
      // You could add a toast notification here if available
      console.log("Principal copied to clipboard:", principal);
    } catch (error) {
      console.error("Failed to copy principal:", error);
    }
  };

  // Handle opening Add Owner modal with pre-filled data
  const handleAddAsOwner = (request: AdminRequest) => {
    setPreFilledOwnerData({
      principal: request.requester_principal,
      name: request.name,
    });
    setShowAddOwnerModal(true);
  };

  // Close Add Owner modal and reset data
  const handleCloseAddOwnerModal = () => {
    setShowAddOwnerModal(false);
    setPreFilledOwnerData(null);
  };

  // Delete admin request
  const handleDeleteRequest = async (requestId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this admin request? This action cannot be undone."
      )
    ) {
      try {
        await deleteRequest.mutateAsync(requestId);
        // Requests will be automatically refetched due to query invalidation
      } catch (error) {
        console.error("Failed to delete admin request:", error);
      }
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "Approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "Approved":
        return "bg-green-100 text-green-800 border border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const requests = getFilteredRequests();
  const pendingCount =
    allRequests?.filter((req) => req.status === "Pending").length || 0;
  const hasSelectedPending = Array.from(selectedRequests).some(
    (id) => allRequests?.find((req) => req.id === id)?.status === "Pending"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-light to-secondary/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark">
              Admin Request Management
            </h1>
            <p className="text-gray-600 mt-2">
              Review and process admin access requests
            </p>
          </div>

          {pendingCount > 0 && (
            <div className="bg-yellow-100 border border-yellow-200 rounded-lg px-4 py-2">
              <span className="text-yellow-800 font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {pendingCount} pending request{pendingCount !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Requests
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {allRequests?.length || 0}
                  </p>
                </div>
                <User className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {pendingCount}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {allRequests?.filter((r) => r.status === "Approved")
                      .length || 0}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">
                    {allRequests?.filter((r) => r.status === "Rejected")
                      .length || 0}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Card>
          <CardHeader>
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {[
                  { id: "pending", label: "Pending", count: pendingCount },
                  {
                    id: "all",
                    label: "All Requests",
                    count: allRequests?.length || 0,
                  },
                  {
                    id: "approved",
                    label: "Approved",
                    count:
                      allRequests?.filter((r) => r.status === "Approved")
                        .length || 0,
                  },
                  {
                    id: "rejected",
                    label: "Rejected",
                    count:
                      allRequests?.filter((r) => r.status === "Rejected")
                        .length || 0,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </CardHeader>

          {/* Bulk Actions */}
          {selectedRequests.size > 0 && hasSelectedPending && (
            <CardContent className="p-4 bg-primary/5 border-b">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary">
                  {selectedRequests.size} request
                  {selectedRequests.size !== 1 ? "s" : ""} selected
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleBulkAction(true)}
                    disabled={processRequest.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve Selected
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleBulkAction(false)}
                    disabled={processRequest.isPending}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject Selected
                  </Button>
                </div>
              </div>
            </CardContent>
          )}

          {/* Requests List */}
          <CardContent className="p-0">
            {isLoadingAll || isLoadingPending ? (
              <div className="flex items-center justify-center p-8">
                <LoadingSpinner />
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center p-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No requests found
                </h3>
                <p className="text-gray-600">
                  {activeTab === "pending"
                    ? "There are no pending admin requests at this time."
                    : `No ${activeTab} requests found.`}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl ">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        {activeTab === "pending" &&
                          requests.some((r) => r.status === "Pending") && (
                            <input
                              type="checkbox"
                              checked={
                                selectedRequests.size > 0 &&
                                selectedRequests.size ===
                                  requests.filter((r) => r.status === "Pending")
                                    .length
                              }
                              onChange={handleSelectAll}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          )}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Requester
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reason
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requests.map((request) => (
                      <RequestRow
                        key={request.id}
                        request={request}
                        isSelected={selectedRequests.has(request.id)}
                        onSelect={handleSelectRequest}
                        onApprove={(id) => handleSingleAction(id, true)}
                        onReject={(id) => {
                          setCurrentRequestId(id);
                          setShowRejectModal(true);
                        }}
                        onDelete={handleDeleteRequest}
                        onCopyPrincipal={handleCopyPrincipal}
                        onAddAsOwner={handleAddAsOwner}
                        isProcessing={processRequest.isPending}
                        formatDate={formatDate}
                        getStatusIcon={getStatusIcon}
                        getStatusColor={getStatusColor}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-red-600">
                  Reject Admin Request
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Please provide a reason for rejecting this admin request:
                </p>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                  rows={4}
                  placeholder="Enter rejection reason..."
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowRejectModal(false);
                      setRejectionReason("");
                      setCurrentRequestId("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleRejectWithReason}
                    disabled={
                      !rejectionReason.trim() || processRequest.isPending
                    }
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject Request
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add Owner Modal */}
        <AddOwnerModal
          isOpen={showAddOwnerModal}
          onClose={handleCloseAddOwnerModal}
          onSuccess={() => {
            handleCloseAddOwnerModal();
            refetchAll();
            refetchPending();
          }}
          preFilledData={preFilledOwnerData || undefined}
        />
      </div>
    </div>
  );
};

// Separate component for individual request rows
interface RequestRowProps {
  request: AdminRequest;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
  onCopyPrincipal: (principal: string) => void;
  onAddAsOwner: (request: AdminRequest) => void;
  isProcessing: boolean;
  formatDate: (timestamp: bigint) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusColor: (status: string) => string;
}

const RequestRow: React.FC<RequestRowProps> = ({
  request,
  isSelected,
  onSelect,
  onApprove,
  onReject,
  onDelete,
  onCopyPrincipal,
  onAddAsOwner,
  isProcessing,
  formatDate,
  getStatusIcon,
  getStatusColor,
}) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        {request.status === "Pending" && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(request.id)}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">
              {request.name}
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-500 truncate max-w-xs font-mono">
                {request.requester_principal}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onCopyPrincipal(request.requester_principal)}
                className="h-6 w-6 p-0 hover:bg-gray-100"
                title="Copy Principal"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 max-w-xs">
        <div className="text-sm text-gray-900 truncate" title={request.reason}>
          {request.reason}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium gap-1 ${getStatusColor(request.status)}`}
        >
          {getStatusIcon(request.status)}
          {request.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {formatDate(request.requested_at)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex flex-col gap-2">
          {request.status === "Pending" ? (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => onApprove(request.id)}
                disabled={isProcessing}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onReject(request.id)}
                disabled={isProcessing}
              >
                <XCircle className="h-3 w-3 mr-1" />
                Reject
              </Button>
            </div>
          ) : request.status === "Approved" ? (
            <div className="flex flex-col gap-2">
              <div className="text-green-600 text-xs font-medium">
                {request.status}
                {request.processed_at && request.processed_at !== 0n ? (
                  <div className="text-gray-400">
                    {formatDate(request.processed_at)}
                  </div>
                ) : null}
              </div>
              <Button
                size="sm"
                onClick={() => onAddAsOwner(request)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <UserPlus className="h-3 w-3 mr-1" />
                Add as Owner
              </Button>
            </div>
          ) : (
            <div className="text-gray-400 text-xs">
              {request.status}
              {request.processed_at && request.processed_at !== 0n ? (
                <div className="text-gray-400">
                  {formatDate(request.processed_at)}
                </div>
              ) : null}
            </div>
          )}

          {/* Delete button - always available */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(request.id)}
            disabled={isProcessing}
            className="text-red-600 hover:!text-red-700 hover:bg-red-50 border-red-200"
            title="Delete Request"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default AdminRequestManager;
