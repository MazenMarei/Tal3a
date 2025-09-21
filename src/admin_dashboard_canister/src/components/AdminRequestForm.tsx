import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle, Clock, XCircle } from "lucide-react";
import {
  useSubmitAdminRequest,
  useMyAdminRequest,
} from "@/hooks/useAdminRequest";
import { useIsAuthenticated } from "@/hooks/useAuth";
import { useOwnerInfo } from "@/hooks/useAdminRequest";
interface AdminRequestFormData {
  name: string;
  reason: string;
}

interface AdminRequestFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

// Helper function to format bigint timestamps
const formatTimestamp = (timestamp: bigint): string => {
  try {
    // Convert nanoseconds to milliseconds
    const milliseconds = Number(timestamp / 1_000_000n);
    return new Date(milliseconds).toLocaleString();
  } catch (error) {
    return "Invalid date";
  }
};

const AdminRequestForm: React.FC<AdminRequestFormProps> = ({
  onSuccess,
  onError,
}) => {
  const { data: user } = useOwnerInfo();
  const { data: isAuthenticated } = useIsAuthenticated();
  const submitAdminRequestMutation = useSubmitAdminRequest();
  const {
    data: myAdminRequest,
    isLoading,
    error: requestError,
  } = useMyAdminRequest();

  const [formData, setFormData] = useState<AdminRequestFormData>({
    name: "",
    reason: "",
  });

  const [existingRequest, setExistingRequest] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Load existing request on component mount
  useEffect(() => {
    if (isAuthenticated && myAdminRequest) {
      if ("Err" in myAdminRequest) {
        console.error("Error fetching admin request:", myAdminRequest.Err);
        return;
      }

      setExistingRequest(myAdminRequest.Ok[0]);
      // Pre-populate form with existing data (note: backend only has name and reason)
      setFormData({
        name: myAdminRequest.Ok[0]?.name || "",
        reason: myAdminRequest.Ok[0]?.reason || "",
      });
    }
  }, [isAuthenticated, myAdminRequest]);

  const handleInputChange = (
    field: keyof AdminRequestFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear errors when user starts typing
    if (submitError) {
      setSubmitError("");
    }
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!formData.name.trim()) {
      errors.push("Name is required");
    }

    if (!formData.reason.trim()) {
      errors.push("Message is required");
    } else if (formData.reason.trim().length < 10) {
      errors.push("Message must be at least 10 characters long");
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      setSubmitError("You must be logged in to submit a request");
      return;
    }

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setSubmitError(validationErrors.join(", "));
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const result = await submitAdminRequestMutation.mutateAsync({
        name: formData.name.trim(),
        reason: formData.reason.trim(),
      });
      if ("Err" in result) {
        const errorMessage = `Error ${result.Err.code}: ${result.Err.message}`;
        setSubmitError(errorMessage);
        onError?.(errorMessage);
        return;
      }
      if (result) {
        setSubmitSuccess(true);
        setExistingRequest(result);
        onSuccess?.();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to submit request";
      setSubmitError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "Approved":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "Rejected":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  // Show existing request status if it exists
  if (existingRequest && !submitSuccess) {
    {
      console.log(existingRequest);
    }
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(Object.keys(existingRequest.status)[0])}
            Admin Access Request
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`p-4 rounded-lg border ${getStatusIcon(Object.keys(existingRequest.status)[0])}`}
          >
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon(Object.keys(existingRequest.status)[0])}
              <span className="font-medium">
                Status: {Object.keys(existingRequest.status)[0]}
              </span>
            </div>

            {Object.keys(existingRequest.status)[0] === "Pending" && (
              <p className="text-sm">
                Your request is being reviewed by our administrators. You will
                be notified once it has been processed.
              </p>
            )}

            {Object.keys(existingRequest.status)[0] === "Approved" && (
              <p className="text-sm">
                Congratulations! Your admin access has been approved. You should
                now have administrative privileges.
              </p>
            )}

            {Object.keys(existingRequest.status)[0] === "Rejected" && (
              <p className="text-sm">
                Your request was not approved. Please see the reason below and
                feel free to submit a new request if applicable.
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <div className="text-sm text-gray-900 p-2 bg-gray-50 rounded">
                {existingRequest.name}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <div className="text-sm text-gray-900 p-2 bg-gray-50 rounded whitespace-pre-wrap">
                {existingRequest.reason}
              </div>
            </div>

            {Object.keys(existingRequest.status)[0] === "Rejected" &&
              existingRequest.rejection_reason && (
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-1">
                    Rejection Reason
                  </label>
                  <p className="text-red-900 bg-red-50 p-3 rounded-lg border border-red-200">
                    {existingRequest.rejection_reason}
                  </p>
                </div>
              )}

            {existingRequest.processed_at &&
              existingRequest.processed_at !== 0n && (
                <div className="text-sm text-gray-500 text-center pt-2">
                  Processed on {formatTimestamp(existingRequest.processed_at)}
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show success message after submission
  if (submitSuccess && existingRequest) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            Request Submitted Successfully!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-gray-700">
              Your admin access request has been submitted and is now under
              review.
            </p>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Request ID:</strong>{" "}
                {existingRequest.id?.toString() || "N/A"}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Submitted:</strong>{" "}
                {formatTimestamp(existingRequest.created_at)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show form for new requests
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Request Admin Access</CardTitle>
        <p className="text-sm text-gray-600">
          Please fill out the form below to request administrative access to the
          platform.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name *
            </label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("name", e.target.value)
              }
              placeholder="Enter your full name"
              disabled={isSubmitting}
              className="w-full"
            />
          </div>

          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Message for Admin Access *
            </label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleInputChange("reason", e.target.value)
              }
              placeholder="Please explain why you need administrative access (minimum 10 characters)"
              disabled={isSubmitting}
              rows={4}
              className="w-full"
            />
          </div>

          {submitError && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
              {submitError}
            </div>
          )}

          {requestError && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
              Error: {requestError.message || "An error occurred"}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || isLoading || !isAuthenticated}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting Request...
              </>
            ) : (
              "Submit Admin Request"
            )}
          </Button>

          {!isAuthenticated && (
            <div className="text-amber-600 text-sm bg-amber-50 p-3 rounded-lg border border-amber-200 text-center">
              You must be logged in to submit an admin request.
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminRequestForm;
