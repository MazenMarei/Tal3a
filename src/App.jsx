import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/landing';
import Login from './pages/login';
import Groups from './pages/groups';
import Events from './pages/events';
import Profile from './pages/profile';
import Settings from './pages/settings';
import Onboarding from './pages/onboarding';
import LoginFlow from './pages/LoginFlow';
import NotFoundPage from './pages/notFound';
import Posts from './pages/posts';
import CreatePost from './pages/createPost';
import EditProfile from './pages/editProfile';
import Map from './pages/map';
import { DataProvider } from './context/DataContext';
import { ProfileProvider } from './context/ProfileContext';
import { NotificationProvider } from './context/NotificationContext';
import { EventParticipationProvider } from './context/EventsParticipationContext';
import { CreateGroupProvider } from './context/CreateGroupContext';
import { CreateEventProvider } from './context/CreateEventContext';
import GroupPosts from './pages/groupPosts';
import EventDetails from './pages/eventDetails';
import Notification from './pages/notification';
import CreateEvent from './pages/createEvent';
import CreateGroup from './pages/createGroup';

const isAuthenticated = true; 

const ProtectedRoute = ({ element }) => {
  const location = useLocation();
  return isAuthenticated ? element : <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

const App = () => {
  return (
    <DataProvider>
      <ProfileProvider>
        <NotificationProvider>
          <EventParticipationProvider>
            <CreateGroupProvider>
              <CreateEventProvider>
                <HelmetProvider>
                  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Helmet>
                      <title>Egypt Sports Community</title>
                      <meta name="description" content="Join the Egypt Sports Community to explore groups, events, and activities across Egyptian cities." />
                      <meta name="keywords" content="Egypt sports, groups, events, community, Cairo, Alexandria, Luxor" />
                      <meta name="robots" content="index, follow" />
                      <meta property="og:title" content="Egypt Sports Community" />
                      <meta property="og:description" content="Discover sports groups and events in Egypt." />
                      <meta property="og:image" content="https://yourdomain.com/og-image.jpg" />
                      <meta property="og:url" content="https://yourdomain.com" />
                      <meta name="twitter:card" content="summary_large_image" />
                    </Helmet>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<Onboarding />} />
                      <Route path="/home" element={<LandingPage />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/login-flow/*" element={<LoginFlow />} />
                      {/* Protected routes */}
                      <Route path="/groups" element={<ProtectedRoute element={<Groups />} />} />
                      <Route path="/events" element={<ProtectedRoute element={<Events />} />} />
                      <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
                      <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
                      <Route path="/posts" element={<ProtectedRoute element={<Posts />} />} />
                      <Route path="/createPost" element={<ProtectedRoute element={<CreatePost />} />} />
                      <Route path="/editProfile" element={<ProtectedRoute element={<EditProfile />} />} />
                      <Route path="/map" element={<ProtectedRoute element={<Map />} />} />
                      <Route path="/groups/:groupId/posts" element={<ProtectedRoute element={<GroupPosts />} />} />
                      <Route path="/events/:eventId/details" element={<ProtectedRoute element={<EventDetails />} />} />
                      <Route path="/notifications" element={<ProtectedRoute element={<Notification />} />} />
                      <Route path="/createEvent" element={<ProtectedRoute element={<CreateEvent />} />} />
                      <Route path="/createGroup" element={<ProtectedRoute element={<CreateGroup />} />} />
                      {/* Catch-all route for 404 */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </div>
                </HelmetProvider>
              </CreateEventProvider>
            </CreateGroupProvider>
          </EventParticipationProvider>
        </NotificationProvider>
      </ProfileProvider>
    </DataProvider>
  );
};

export default App;