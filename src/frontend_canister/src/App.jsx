// Main App component - Sets up routing and context providers for the Tal3a sports community platform
import { HelmetProvider, Helmet } from "react-helmet-async";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Page imports
import LandingPage from "./pages/landing";
import Login from "./pages/login";
import Groups from "./pages/groups";
import Events from "./pages/events";
import Profile from "./pages/profile";
import Settings from "./pages/settings";
import Onboarding from "./pages/onboarding";
import LoginFlow from "./pages/loginFlow";
import NotFoundPage from "./pages/notFound";
import Posts from "./pages/posts";
import CreatePost from "./pages/createPost";
import EditProfile from "./pages/editProfile";
import Map from "./pages/map";
import Promotions from "./pages/promotions";
import GroupPosts from "./pages/groupPosts";
import EventDetails from "./pages/eventDetails";
import Notification from "./pages/notification";
import CreateEvent from "./pages/createEvent";
import CreateGroup from "./pages/createGroup";
import WhoAmI from "./pages/whoami";
import IntegrationExample from "./pages/IntegrationExample";
import TestRegistrationFlow from "./pages/TestRegistrationFlow";

// Context providers
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { EventsProvider } from "./context/EventsContext";
import { SocialProvider } from "./context/SocialContext";
import { DataProvider } from "./context/DataContext";
import { LoginFlowProvider } from "./context/LoginFlowContext";
import { useAuth } from "./hooks/useCanisterHooks";
import { NotificationProvider } from "./context/NotificationContext";
import { EventParticipationProvider } from "./context/EventsParticipationContext";
import { CreateGroupProvider } from "./context/CreateGroupContext";
import { CreateEventProvider } from "./context/CreateEventContext";

// Protected route wrapper - redirects to login if user not authenticated
const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  console.log("isAuthenticated", isAuthenticated);

  const location = useLocation();
  return isAuthenticated ? (
    element
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} replace />
  );
};

const App = () => {
  return (
    // Wrap entire app with context providers for global state management
    <AuthProvider>
      <UserProvider>
        <EventsProvider>
          <SocialProvider>
            <DataProvider>
              <LoginFlowProvider>
                <NotificationProvider>
                  <EventParticipationProvider>
                    <CreateGroupProvider>
                      <CreateEventProvider>
                        <HelmetProvider>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              minHeight: "100vh",
                            }}
                          >
                            {/* SEO meta tags for the application */}
                            <Helmet>
                              <title>Egypt Sports Community</title>
                              <meta
                                name="description"
                                content="Join the Egypt Sports Community to explore groups, events, and activities across Egyptian cities."
                              />
                              <meta
                                name="keywords"
                                content="Egypt sports, groups, events, community, Cairo, Alexandria, Luxor"
                              />
                              <meta name="robots" content="index, follow" />
                              <meta
                                property="og:title"
                                content="Egypt Sports Community"
                              />
                              <meta
                                property="og:description"
                                content="Discover sports groups and events in Egypt."
                              />
                              <meta
                                property="og:image"
                                content="https://yourdomain.com/og-image.jpg"
                              />
                              <meta
                                property="og:url"
                                content="https://yourdomain.com"
                              />
                              <meta
                                name="twitter:card"
                                content="summary_large_image"
                              />
                            </Helmet>
                            {/* Application routing configuration */}
                            <Routes>
                              {/* Public routes - accessible without authentication */}
                              <Route path="/" element={<Onboarding />} />
                              <Route path="/home" element={<LandingPage />} />
                              <Route path="/login" element={<Login />} />
                              <Route
                                path="/login-flow/*"
                                element={<LoginFlow />}
                              />

                              {/* Protected routes - require authentication */}
                              <Route
                                path="/groups"
                                element={
                                  <ProtectedRoute element={<Groups />} />
                                }
                              />
                              <Route
                                path="/events"
                                element={
                                  <ProtectedRoute element={<Events />} />
                                }
                              />
                              <Route
                                path="/profile"
                                element={
                                  <ProtectedRoute element={<Profile />} />
                                }
                              />
                              <Route
                                path="/settings"
                                element={
                                  <ProtectedRoute element={<Settings />} />
                                }
                              />
                              <Route
                                path="/posts"
                                element={<ProtectedRoute element={<Posts />} />}
                              />
                              <Route
                                path="/createPost"
                                element={
                                  <ProtectedRoute element={<CreatePost />} />
                                }
                              />
                              <Route
                                path="/editProfile"
                                element={
                                  <ProtectedRoute element={<EditProfile />} />
                                }
                              />
                              <Route
                                path="/map"
                                element={<ProtectedRoute element={<Map />} />}
                              />
                              <Route
                                path="/promotions"
                                element={
                                  <ProtectedRoute element={<Promotions />} />
                                }
                              />
                              <Route
                                path="/groups/:groupId/posts"
                                element={
                                  <ProtectedRoute element={<GroupPosts />} />
                                }
                              />
                              <Route
                                path="/events/:eventId/details"
                                element={
                                  <ProtectedRoute element={<EventDetails />} />
                                }
                              />
                              <Route
                                path="/notifications"
                                element={
                                  <ProtectedRoute element={<Notification />} />
                                }
                              />
                              <Route
                                path="/createEvent"
                                element={
                                  <ProtectedRoute element={<CreateEvent />} />
                                }
                              />
                              <Route
                                path="/createGroup"
                                element={
                                  <ProtectedRoute element={<CreateGroup />} />
                                }
                              />
                              <Route path="/whoami" element={<WhoAmI />} />
                              <Route
                                path="/integration"
                                element={<IntegrationExample />}
                              />
                              <Route
                                path="/test-registration"
                                element={<TestRegistrationFlow />}
                              />
                              {/* Catch-all route for 404 */}
                              <Route path="*" element={<NotFoundPage />} />
                            </Routes>
                          </div>
                        </HelmetProvider>
                      </CreateEventProvider>
                    </CreateGroupProvider>
                  </EventParticipationProvider>
                </NotificationProvider>
              </LoginFlowProvider>
            </DataProvider>
          </SocialProvider>
        </EventsProvider>
      </UserProvider>
    </AuthProvider>
  );
};

export default App;
