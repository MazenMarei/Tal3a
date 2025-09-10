// Main App component - Sets up routing and context providers for the Tal3a sports community platform
import { HelmetProvider, Helmet } from "react-helmet-async";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Landing from "@/pages/landing";
// Protected route wrapper - redirects to login if user not authenticated
import { ReactElement } from "react";
import { useCurrentUser } from "./hooks/useAuth";
import Login from "./pages/login";
import MiddlePage from "./pages/MiddlePage";
// import { ReactQueryExamples } from "./components/ReactQueryExamples";
// import { UserDashboard } from "./components/UserDashboard";

type ProtectedRouteProps = {
  element: ReactElement;
};

// const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
// const { isAuthenticated } = useAuth();
//   const location = useLocation();
//   return isAuthenticated ? (
//     element
//   ) : (
//     <Navigate to="/login" state={{ from: location.pathname }} replace />
//   );
// };

const App = () => {
  return (
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
          <meta property="og:title" content="Egypt Sports Community" />
          <meta
            property="og:description"
            content="Discover sports groups and events in Egypt."
          />
          <meta
            property="og:image"
            content="https://yourdomain.com/og-image.jpg"
          />
          <meta property="og:url" content="https://yourdomain.com" />
          <meta name="twitter:card" content="summary_large_image" />
        </Helmet>

        {/* Application routing configuration */}
        <Routes>
          {/* Public routes - accessible without authentication */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/middlepage" element={<MiddlePage />} />
          {/* <Route path="/ReactQueryExamples" element={<ReactQueryExamples />} />
          <Route path="/UserDashboard" element={<UserDashboard />} /> */}
        </Routes>
      </div>
    </HelmetProvider>
  );
};

export default App;
