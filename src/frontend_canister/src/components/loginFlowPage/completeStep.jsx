import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, User, MapPin, Trophy, AlertCircle } from "lucide-react";
import { useLoginFlow } from "../../context/LoginFlowContext";
import { useUser } from "../../hooks/useCanisterHooks";
import LoadingCard from "../loadingPage/loadingCard";
import toast from "react-hot-toast";

const Step5Complete = () => {
  const { formData, resetFormData, isFromUserNotFound } = useLoginFlow();
  const { createUserFromLoginFlow, loading } = useUser();
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const handleCreateAccount = async () => {
    try {
      setIsCreatingUser(true);
      const result = await createUserFromLoginFlow();

      if (result.success) {
        resetFormData(); // Clear the form data
        toast.success("Account created successfully! Welcome to Tal3a!");
      } else {
        toast.error(result.error || "Failed to create account");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error("Failed to create account. Please try again.");
    } finally {
      setIsCreatingUser(false);
    }
  };

  if (loading || isCreatingUser) {
    return (
      <div className="w-full max-w-md mx-auto">
        <LoadingCard message="Creating your account..." />
      </div>
    );
  }

  const getSportNames = (sports) => {
    const sportMap = {
      Basketball: "Basketball",
      Tennis: "Tennis",
      Volleyball: "Volleyball",
      Football: "Football",
      Swimming: "Swimming",
      Running: "Running",
      Cycling: "Cycling",
      Boxing: "Boxing",
      Yoga: "Yoga",
      Gym: "Gym",
    };

    return sports
      .map((sport) => {
        if (typeof sport === "object" && Object.keys(sport).length === 1) {
          return sportMap[Object.keys(sport)[0]] || Object.keys(sport)[0];
        }
        return sportMap[sport] || sport;
      })
      .join(", ");
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isFromUserNotFound ? "Complete Your Profile" : "Almost Done!"}
        </h1>
        <p className="text-gray-600 text-sm">
          {isFromUserNotFound
            ? "Please review and confirm your profile information"
            : "Review your information and create your account"}
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Profile Summary
        </h3>

        {/* Location */}
        <div className="flex items-start mb-4">
          <MapPin className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
          <div>
            <p className="font-medium text-gray-900">Location</p>
            <p className="text-sm text-gray-600">
              {formData.city?.name || "Not specified"},{" "}
              {formData.governorate?.name || "Not specified"}
            </p>
          </div>
        </div>

        {/* Sports */}
        <div className="flex items-start mb-4">
          <Trophy className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
          <div>
            <p className="font-medium text-gray-900">Sports Interests</p>
            <p className="text-sm text-gray-600">
              {formData.sports?.length > 0
                ? getSportNames(formData.sports)
                : "No sports selected"}
            </p>
          </div>
        </div>

        {/* Personal Info */}
        <div className="flex items-start">
          <User className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
          <div>
            <p className="font-medium text-gray-900">Personal Information</p>
            <p className="text-sm text-gray-600">
              Username: {formData.username || "Not specified"}
            </p>
            {formData.bio && (
              <p className="text-sm text-gray-600 mt-1">Bio: {formData.bio}</p>
            )}
          </div>
        </div>
      </div>

      {/* Warning for incomplete data */}
      {(!formData.username ||
        !formData.city ||
        !formData.governorate ||
        !formData.sports?.length) && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-amber-600 mr-2" />
            <p className="text-amber-800 text-sm">
              Some required information is missing. Please go back and complete
              all steps.
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleCreateAccount}
          disabled={
            !formData.username ||
            !formData.city ||
            !formData.governorate ||
            !formData.sports?.length ||
            isCreatingUser
          }
          className="w-full py-3 text-lg font-medium bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
        >
          {isCreatingUser ? "Creating Account..." : "Create Account"}
        </Button>

        <Button
          onClick={() => window.history.back()}
          variant="outline"
          className="w-full py-3 text-lg font-medium border-2 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl"
        >
          Go Back
        </Button>
      </div>

      {/* Additional Info */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          By creating an account, you agree to our Terms of Service and Privacy
          Policy
        </p>
      </div>
    </div>
  );
};

export default Step5Complete;
