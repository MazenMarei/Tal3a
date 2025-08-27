// User Context - Manages user data and profile operations
import React, { createContext, useState, useEffect } from "react";
import { useAuth } from "../hooks/useCanisterHooks";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { actors, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [governorates, setGovernorates] = useState([]);
  const [shouldRedirectToLoginFlow, setShouldRedirectToLoginFlow] =
    useState(false);

  // Fetch current user data
  const fetchUser = async () => {
    if (!actors.user || !isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      const result = await actors.user.get_current_user();

      if (result.Ok) {
        setUser(result.Ok);
        setShouldRedirectToLoginFlow(false);
        // Clear the user not found flag if user is found
        localStorage.removeItem("tal3a_user_not_found");
        localStorage.removeItem("tal3a_navigate_to");
      } else {

        
        console.error("Failed to fetch user:", result.Err);
        setError(result.Err);

        // Check if user not found and not already redirecting
        if (result.Err === "User not found") {
          console.log("User not found, redirecting to login flow...");
          setShouldRedirectToLoginFlow(true);

          // Store flag in localStorage to trigger login flow
          localStorage.setItem("tal3a_user_not_found", "true");
          localStorage.setItem("tal3a_navigate_to", "/login-flow/location");

          // Use navigate instead of window.location to prevent full page reload
          navigate("/login-flow/location");
          
          toast.error("Please complete your profile setup");
        }
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setError(error.message);
      toast.error("Failed to fetch user profile");
    } finally {
      setLoading(false);
    }
  };

  // Fetch governorates
  const fetchGovernorates = async () => {
    if (!actors.user) return;

    try {
      const result = await actors.user.get_all_governorates();
      setGovernorates(result);
    } catch (error) {
      console.error("Error fetching governorates:", error);
    }
  };

  // Fetch cities for a governorate
  const fetchCities = async (governorateId) => {
    if (!actors.user) return [];

    try {
      const result = await actors.user.get_all_cities_in_governorate(
        governorateId
      );
      return result;
    } catch (error) {
      console.error("Error fetching cities:", error);
      return [];
    }
  };

  // Create new user
  const createUser = async (userData) => {
    if (!actors.user) {
      toast.error("User service not available");
      return { success: false, error: "Service unavailable" };
    }

    try {
      setLoading(true);
      const result = await actors.user.create_user(userData);

      if (result.Ok) {
        setUser(result.Ok);
        toast.success("Profile created successfully!");
        return { success: true, user: result.Ok };
      } else {
        toast.error(`Failed to create profile: ${result.Err}`);
        return { success: false, error: result.Err };
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create profile");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (updateData) => {
    if (!actors.user) {
      toast.error("User service not available");
      return { success: false, error: "Service unavailable" };
    }

    try {
      setLoading(true);
      const result = await actors.user.update_profile(updateData);

      if (result.Ok) {
        await fetchUser(); // Refresh user data
        toast.success("Profile updated successfully!");
        return { success: true };
      } else {
        toast.error(`Failed to update profile: ${result.Err}`);
        return { success: false, error: result.Err };
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Add user activity
  const addActivity = async (activity) => {
    if (!actors.user) {
      toast.error("User service not available");
      return { success: false, error: "Service unavailable" };
    }

    try {
      const result = await actors.user.add_activity(activity);

      if (result.Ok) {
        await fetchUser(); // Refresh user data
        toast.success("Activity added successfully!");
        return { success: true };
      } else {
        toast.error(`Failed to add activity: ${result.Err}`);
        return { success: false, error: result.Err };
      }
    } catch (error) {
      console.error("Error adding activity:", error);
      toast.error("Failed to add activity");
      return { success: false, error: error.message };
    }
  };

  // Add notification
  const addNotification = async (notification) => {
    if (!actors.user) return { success: false, error: "Service unavailable" };

    try {
      const result = await actors.user.add_notification(notification);

      if (result.Ok) {
        await fetchUser(); // Refresh user data
        return { success: true };
      } else {
        return { success: false, error: result.Err };
      }
    } catch (error) {
      console.error("Error adding notification:", error);
      return { success: false, error: error.message };
    }
  };

  // Mark notification as read
  const markNotificationAsRead = async (notificationId) => {
    if (!actors.user) return { success: false, error: "Service unavailable" };

    try {
      const result = await actors.user.mark_notification_as_read(
        notificationId
      );

      if (result.Ok) {
        await fetchUser(); // Refresh user data
        return { success: true };
      } else {
        return { success: false, error: result.Err };
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return { success: false, error: error.message };
    }
  };

  // Get public user data
  const getPublicUser = async (principalId) => {
    if (!actors.user) return null;

    try {
      const result = await actors.user.get_user(principalId);

      if (result.Ok) {
        return result.Ok;
      } else {
        console.error("Failed to fetch public user:", result.Err);
        return null;
      }
    } catch (error) {
      console.error("Error fetching public user:", error);
      return null;
    }
  };

  // Create user from login flow data
  const createUserFromLoginFlow = async () => {
    const loginFlowData = localStorage.getItem("tal3a_login_flow_data");

    if (!loginFlowData) {
      toast.error(
        "No registration data found. Please complete the login flow."
      );
      navigate("/login-flow/location");
      return { success: false, error: "No registration data" };
    }

    try {
      const parsed = JSON.parse(loginFlowData);
      const userData = {
        username: parsed.formData.username,
        bio: parsed.formData.bio || null,
        city: parsed.formData.city?.id || parsed.formData.city,
        governorate:
          parsed.formData.governorate?.id || parsed.formData.governorate,
        sports: parsed.formData.sports || [],
        free_days: parsed.formData.free_days || null,
        avatar_url: parsed.formData.avatar_url || null,
      };

      console.log("Creating user with data:", userData);
      const result = await createUser(userData);

      if (result.success) {
        // Clear login flow data after successful user creation
        localStorage.removeItem("tal3a_login_flow_data");
        localStorage.removeItem("tal3a_user_not_found");

        // Navigate to home or appropriate page
        navigate("/groups");

        toast.success("Welcome! Your profile has been created successfully.");
      }

      return result;
    } catch (error) {
      console.error("Error parsing login flow data:", error);
      toast.error("Error processing registration data");
      return { success: false, error: error.message };
    }
  };

  // Delete account
  const deleteAccount = async () => {
    if (!actors.user) {
      toast.error("User service not available");
      return { success: false, error: "Service unavailable" };
    }

    try {
      setLoading(true);
      const result = await actors.user.delete_account();

      if (result.Ok) {
        setUser(null);
        toast.success("Account deleted successfully!");
        return { success: true };
      } else {
        toast.error(`Failed to delete account: ${result.Err}`);
        return { success: false, error: result.Err };
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Initialize user data and governorates when authenticated
  useEffect(() => {
    if (isAuthenticated && actors.user) {
      fetchUser();
      fetchGovernorates();
    } else {
      setUser(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, actors.user]);

  const value = {
    user,
    loading,
    error,
    governorates,
    shouldRedirectToLoginFlow,
    fetchUser,
    fetchCities,
    createUser,
    createUserFromLoginFlow,
    updateProfile,
    addActivity,
    addNotification,
    markNotificationAsRead,
    getPublicUser,
    deleteAccount,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export { UserContext };
