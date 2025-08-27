// Login Flow Context - Manages user registration data across login flow steps
import React, { createContext, useState, useContext, useEffect } from "react";

const LoginFlowContext = createContext();

export const useLoginFlow = () => {
  const context = useContext(LoginFlowContext);
  if (!context) {
    throw new Error("useLoginFlow must be used within a LoginFlowProvider");
  }
  return context;
};

export const LoginFlowProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    // Step 1: Location data
    governorate: null,
    city: null,

    // Step 2: Sports preferences
    sports: [],

    // Step 3: Personal information
    username: "",
    bio: "",
    avatar_url: null,
    free_days: null,

    // Step 4: Social/Password (if needed)
    // For now, we'll use Internet Identity so password might not be needed
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isFromUserNotFound, setIsFromUserNotFound] = useState(false);

  // Update form data for specific step
  const updateFormData = (stepData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...stepData,
    }));
  };

  // Navigate to specific step
  const goToStep = (stepNumber) => {
    setCurrentStep(stepNumber);
    const stepRoutes = {
      1: "/login-flow/location",
      2: "/login-flow/sports",
      3: "/login-flow/personal-info",
      4: "/login-flow/social-password",
      5: "/login-flow/complete",
    };

    // Store the target route in localStorage so it can be picked up
    localStorage.setItem("tal3a_navigate_to", stepRoutes[stepNumber]);
  };

  // Go to next step
  const nextStep = () => {
    if (currentStep < 5) {
      goToStep(currentStep + 1);
    }
  };

  // Go to previous step
  const previousStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  // Start login flow (called when user not found)
  const startLoginFlow = (fromUserNotFound = false) => {
    setIsFromUserNotFound(fromUserNotFound);
    setCurrentStep(1);
    localStorage.setItem("tal3a_navigate_to", "/login-flow/location");
  };

  // Get formatted user data for backend
  const getRegistrationData = () => {
    return {
      username: formData.username,
      bio: formData.bio || null,
      city: formData.city?.id || formData.city,
      governorate: formData.governorate?.id || formData.governorate,
      sports: formData.sports,
      free_days: formData.free_days || null,
      avatar_url: formData.avatar_url || null,
    };
  };

  // Reset form data
  const resetFormData = () => {
    setFormData({
      governorate: null,
      city: null,
      sports: [],
      username: "",
      bio: "",
      avatar_url: null,
      free_days: null,
    });
    setCurrentStep(1);
    setIsFromUserNotFound(false);
  };

  // Check if current step is complete
  const isStepComplete = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return formData.governorate && formData.city;
      case 2:
        return formData.sports.length > 0;
      case 3:
        return formData.username.trim() !== "";
      case 4:
        return true; // No additional requirements for now
      case 5:
        return true; // Complete step is always "complete"
      default:
        return false;
    }
  };

  // Check if all steps are complete
  const isFormComplete = () => {
    return (
      formData.governorate &&
      formData.city &&
      formData.sports.length > 0 &&
      formData.username.trim() !== ""
    );
  };

  // Store data in localStorage on changes (for persistence across page reloads)
  useEffect(() => {
    localStorage.setItem(
      "tal3a_login_flow_data",
      JSON.stringify({
        formData,
        currentStep,
        isFromUserNotFound,
      })
    );
  }, [formData, currentStep, isFromUserNotFound]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("tal3a_login_flow_data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.formData) {
          setFormData(parsed.formData);
        }
        if (parsed.currentStep) {
          setCurrentStep(parsed.currentStep);
        }
        if (parsed.isFromUserNotFound !== undefined) {
          setIsFromUserNotFound(parsed.isFromUserNotFound);
        }
      } catch (error) {
        console.error("Error loading saved login flow data:", error);
      }
    }
  }, []); // Only run on mount

  const value = {
    formData,
    currentStep,
    isFromUserNotFound,
    updateFormData,
    goToStep,
    nextStep,
    previousStep,
    startLoginFlow,
    getRegistrationData,
    resetFormData,
    isStepComplete,
    isFormComplete,
  };

  return (
    <LoginFlowContext.Provider value={value}>
      {children}
    </LoginFlowContext.Provider>
  );
};

export default LoginFlowContext;
