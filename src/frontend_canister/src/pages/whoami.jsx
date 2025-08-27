// WhoAmI Test Component - Tests Internet Identity authentication and backend connection
import React, { useState, useEffect } from "react";
import {
  useAuth,
  useUser,
  useEvents,
  useSocial,
} from "../hooks/useCanisterHooks";

const WhoAmI = () => {
  const {
    isAuthenticated,
    principal,
    login,
    logout,
    actors,
    loading: authLoading,
  } = useAuth();
  const { user, loading: userLoading } = useUser();
  const { events, loading: eventsLoading } = useEvents();
  const { groups, posts, loading: socialLoading } = useSocial();

  const [testResults, setTestResults] = useState({});

  // Test backend connectivity
  const testBackendConnections = async () => {
    if (!isAuthenticated || !actors) {
      setTestResults({ error: "Not authenticated or actors not available" });
      return;
    }

    const results = {};

    // Test User Canister
    try {
      if (actors.user) {
        results.userCanister = "✅ Connected";

        // Test user whoami (if available)
        try {
          const currentUser = await actors.user.get_current_user();
          results.userData = currentUser.Ok
            ? "✅ User data loaded"
            : `❌ Error: ${currentUser.Err}`;
        } catch (error) {
          results.userData = `❌ Error: ${error.message}`;
        }

        // Test governorates
        try {
          const governorates = await actors.user.get_all_governorates();
          results.governorates = `✅ Loaded ${governorates.length} governorates`;
        } catch (error) {
          results.governorates = `❌ Error: ${error.message}`;
        }
      } else {
        results.userCanister = "❌ Not connected";
      }
    } catch (error) {
      results.userCanister = `❌ Error: ${error.message}`;
    }

    // Test Event Canister
    try {
      if (actors.event) {
        results.eventCanister = "✅ Connected";

        try {
          const events = await actors.event.get_all_events();
          results.eventsData = `✅ Loaded ${events.length} events`;
        } catch (error) {
          results.eventsData = `❌ Error: ${error.message}`;
        }
      } else {
        results.eventCanister = "❌ Not connected";
      }
    } catch (error) {
      results.eventCanister = `❌ Error: ${error.message}`;
    }

    // Test Social Canister
    try {
      if (actors.social) {
        results.socialCanister = "✅ Connected";

        try {
          const groups = await actors.social.filter_groups({});
          results.groupsData = `✅ Loaded ${groups.length} groups`;
        } catch (error) {
          results.groupsData = `❌ Error: ${error.message}`;
        }

        try {
          const posts = await actors.social.get_unseen_posts();
          results.postsData = `✅ Loaded ${posts.length} posts`;
        } catch (error) {
          results.postsData = `❌ Error: ${error.message}`;
        }
      } else {
        results.socialCanister = "❌ Not connected";
      }
    } catch (error) {
      results.socialCanister = `❌ Error: ${error.message}`;
    }

    setTestResults(results);
  };

  // Handle Internet Identity login
  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await logout();
      setTestResults({});
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Auto-test when authenticated
  useEffect(() => {
    if (isAuthenticated && actors.user && actors.event && actors.social) {
      testBackendConnections();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, actors]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Initializing authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center mb-8">
          Tal3a Backend Integration Test
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Authentication Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              Authentication Status
            </h2>

            <div className="space-y-3">
              <div>
                <strong>Status:</strong>{" "}
                <span
                  className={`font-medium ${
                    isAuthenticated ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isAuthenticated
                    ? "✅ Authenticated"
                    : "❌ Not authenticated"}
                </span>
              </div>

              {principal && (
                <div>
                  <strong>Principal ID:</strong>
                  <div className="bg-white p-2 rounded text-xs font-mono mt-1 break-all">
                    {principal.toString()}
                  </div>
                </div>
              )}

              <div className="pt-4">
                {!isAuthenticated ? (
                  <button
                    onClick={handleLogin}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Login with Internet Identity
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Logout
                    </button>
                    <button
                      onClick={testBackendConnections}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Test Backend Connections
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Backend Test Results */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              Backend Connection Tests
            </h2>

            {Object.keys(testResults).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(testResults).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between items-center py-1"
                  >
                    <span className="font-medium capitalize">
                      {key.replace(/([A-Z])/g, " $1")}:
                    </span>
                    <span className="text-sm">{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                {isAuthenticated
                  ? "Click 'Test Backend Connections' to run tests"
                  : "Please login to test backend connections"}
              </p>
            )}
          </div>
        </div>

        {/* Context Data Display */}
        {isAuthenticated && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Data */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">User Context</h3>
              {userLoading ? (
                <p className="text-blue-600">Loading user data...</p>
              ) : user ? (
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Username:</strong> {user.username}
                  </p>
                  <p>
                    <strong>Sports:</strong> {user.sports?.join(", ") || "None"}
                  </p>
                  <p>
                    <strong>Role:</strong> {Object.keys(user.role)[0]}
                  </p>
                  <p>
                    <strong>Online:</strong> {user.is_online ? "Yes" : "No"}
                  </p>
                </div>
              ) : (
                <p className="text-blue-600">No user data found</p>
              )}
            </div>

            {/* Events Data */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">
                Events Context
              </h3>
              {eventsLoading ? (
                <p className="text-green-600">Loading events...</p>
              ) : (
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Total Events:</strong> {events?.length || 0}
                  </p>
                  <p>
                    <strong>Upcoming:</strong>{" "}
                    {events?.filter((e) => e.status.Upcoming)?.length || 0}
                  </p>
                  <p>
                    <strong>In Progress:</strong>{" "}
                    {events?.filter((e) => e.status.InProgress)?.length || 0}
                  </p>
                  <p>
                    <strong>Completed:</strong>{" "}
                    {events?.filter((e) => e.status.Completed)?.length || 0}
                  </p>
                </div>
              )}
            </div>

            {/* Social Data */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">
                Social Context
              </h3>
              {socialLoading ? (
                <p className="text-purple-600">Loading social data...</p>
              ) : (
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Groups:</strong> {groups?.length || 0}
                  </p>
                  <p>
                    <strong>Posts:</strong> {posts?.length || 0}
                  </p>
                  <p>
                    <strong>Public Groups:</strong>{" "}
                    {groups?.filter((g) => g.public)?.length || 0}
                  </p>
                  <p>
                    <strong>Private Groups:</strong>{" "}
                    {groups?.filter((g) => !g.public)?.length || 0}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">
            Integration Status
          </h3>
          <p className="text-yellow-700 text-sm">
            This page demonstrates the complete integration between the frontend
            and all backend canisters: User Canister, Event Canister, and Social
            Canister. All three contexts are now connected and provide real-time
            data from the Internet Computer backend.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhoAmI;
