// WhoAmI Test Component - Tests Internet Identity authentication and backend connection
import React, { useState } from "react";
import { useProfile } from "../hooks/useProfile";

const WhoAmI = () => {
  const { state, login, logout, isAuthenticated } = useProfile();
  const [principal, setPrincipal] = useState("");

  // Calls backend whoami function to get user's principal ID
  // Calls backend whoami function to get user's principal ID
  const handleWhoAmI = async () => {
    if (!state.actor) {
      setPrincipal("Actor not initialized");
      return;
    }

    try {
      setPrincipal("Loading...");
      // Call backend canister method to get principal
      const result = await state.actor.whoami();
      setPrincipal(result.toString());
    } catch (error) {
      console.error("Error calling whoami:", error);
      setPrincipal(`Error: ${error.message}`);
    }
  };

  // Handle Internet Identity login
  const handleLogin = async () => {
    try {
      await login("ii"); // Use Internet Identity
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // Handle user logout and clear principal
  const handleLogout = async () => {
    try {
      await logout();
      setPrincipal("");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Who Am I?</h1>

        <div className="space-y-4">
          {/* Login/Logout button based on authentication status */}
          {!isAuthenticated ? (
            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Login with Internet Identity
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Logout
            </button>
          )}

          {/* WhoAmI test button - disabled when not authenticated */}
          <button
            onClick={handleWhoAmI}
            disabled={!isAuthenticated}
            className={`w-full font-medium py-2 px-4 rounded-lg transition-colors ${
              isAuthenticated
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Who Am I?
          </button>

          {/* Display principal ID result */}
          {principal && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Your Principal ID:</h2>
              <div className="bg-gray-100 p-3 rounded-lg break-all text-sm">
                {principal}
              </div>
            </div>
          )}

          {/* Display connection status information */}
          <div className="mt-4 text-sm text-gray-600">
            <p>
              <strong>Status:</strong>{" "}
              {isAuthenticated ? "Authenticated" : "Not authenticated"}
            </p>
            <p>
              <strong>Actor:</strong>{" "}
              {state.actor ? "Initialized" : "Not initialized"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhoAmI;
