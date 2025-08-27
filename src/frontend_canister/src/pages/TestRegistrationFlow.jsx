// Simple Test Page for User Registration Flow
import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "../hooks/useCanisterHooks";
import { useLoginFlow } from "../context/LoginFlowContext";
import { Button } from "@/components/ui/button";

const TestRegistrationFlow = () => {
  const { isAuthenticated, actors, login } = useAuth();
  const { user, loading: userLoading, createUserFromLoginFlow } = useUser();
  const { formData, startLoginFlow, resetFormData } = useLoginFlow();
  const [testStage, setTestStage] = useState("initial");
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  useEffect(() => {
    if (isAuthenticated) {
      addLog("✅ User is authenticated");
      if (user) {
        addLog(`✅ User profile exists: ${user.username}`);
        setTestStage("has_profile");
      } else {
        addLog("⚠️ User authenticated but no profile found");
        setTestStage("needs_profile");
      }
    } else {
      addLog("❌ User not authenticated");
      setTestStage("needs_auth");
    }
  }, [isAuthenticated, user]);

  const handleLogin = () => {
    addLog("🔄 Starting login process...");
    login();
  };

  const handleStartRegistration = () => {
    addLog("🔄 Starting registration flow...");
    startLoginFlow(true);
    window.location.href = "/login-flow/location";
  };

  const handleTestCreateUser = async () => {
    addLog("🔄 Testing user creation with dummy data...");

    // Set some dummy data for testing
    const dummyData = {
      formData: {
        username: "testuser_" + Date.now(),
        bio: "Test user created from test page",
        city: { id: 1, name: "Cairo" },
        governorate: { id: 1, name: "Cairo" },
        sports: [{ Basketball: null }],
        free_days: ["Monday", "Wednesday"],
      },
    };

    localStorage.setItem("tal3a_login_flow_data", JSON.stringify(dummyData));

    const result = await createUserFromLoginFlow();

    if (result.success) {
      addLog("✅ User created successfully!");
      setTestStage("success");
    } else {
      addLog(`❌ User creation failed: ${result.error}`);
    }
  };

  const handleClearData = () => {
    resetFormData();
    localStorage.removeItem("tal3a_login_flow_data");
    localStorage.removeItem("tal3a_user_not_found");
    addLog("🧹 Cleared all registration data");
  };

  const handleCheckActors = () => {
    addLog(`🔍 Actors status:`);
    addLog(
      `  User actor: ${actors?.user ? "✅ Available" : "❌ Not available"}`
    );
    addLog(
      `  Social actor: ${actors?.social ? "✅ Available" : "❌ Not available"}`
    );
    addLog(
      `  Event actor: ${actors?.event ? "✅ Available" : "❌ Not available"}`
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Registration Flow Test Page</h1>

      {/* Status Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Current Status</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="font-medium">Authentication</p>
            <p className={isAuthenticated ? "text-green-600" : "text-red-600"}>
              {isAuthenticated ? "✅ Authenticated" : "❌ Not Authenticated"}
            </p>
          </div>
          <div>
            <p className="font-medium">User Profile</p>
            <p className={user ? "text-green-600" : "text-orange-600"}>
              {userLoading
                ? "⏳ Loading..."
                : user
                ? "✅ Exists"
                : "❌ Not Found"}
            </p>
          </div>
          <div>
            <p className="font-medium">Test Stage</p>
            <p className="text-blue-600">{testStage}</p>
          </div>
        </div>
      </div>

      {/* Actions Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={handleLogin}
            disabled={isAuthenticated}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isAuthenticated
              ? "Already Logged In"
              : "Login with Internet Identity"}
          </Button>

          <Button
            onClick={handleCheckActors}
            className="bg-purple-500 hover:bg-purple-600"
          >
            Check Canister Actors
          </Button>

          <Button
            onClick={handleStartRegistration}
            disabled={!isAuthenticated}
            className="bg-green-500 hover:bg-green-600"
          >
            Start Registration Flow
          </Button>

          <Button
            onClick={handleTestCreateUser}
            disabled={!isAuthenticated}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Test Create User (Dummy Data)
          </Button>

          <Button
            onClick={handleClearData}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50"
          >
            Clear All Data
          </Button>
        </div>
      </div>

      {/* Current Form Data */}
      {formData && Object.keys(formData).length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Form Data</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      )}

      {/* Debug Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
        <div className="space-y-2 text-sm">
          <p>
            <strong>User not found flag:</strong>{" "}
            {localStorage.getItem("tal3a_user_not_found") || "false"}
          </p>
          <p>
            <strong>Saved form data:</strong>{" "}
            {localStorage.getItem("tal3a_login_flow_data") ? "Yes" : "No"}
          </p>
          <p>
            <strong>Navigate to:</strong>{" "}
            {localStorage.getItem("tal3a_navigate_to") || "None"}
          </p>
        </div>
      </div>

      {/* Logs */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Logs</h2>
        <div className="bg-gray-900 text-green-400 p-4 rounded text-sm font-mono h-64 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
          {logs.length === 0 && (
            <div className="text-gray-500">No logs yet...</div>
          )}
        </div>
        <Button onClick={() => setLogs([])} variant="outline" className="mt-2">
          Clear Logs
        </Button>
      </div>
    </div>
  );
};

export default TestRegistrationFlow;
