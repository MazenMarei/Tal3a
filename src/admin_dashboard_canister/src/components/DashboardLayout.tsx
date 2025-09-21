/**
 * Dashboard Layout Component
 *
 * Main layout wrapper with sidebar navigation for authenticated routes
 */

import React from "react";
import { Outlet } from "@tanstack/react-router";
import Sidebar from "./Sidebar";
import { useIsAuthenticated } from "../hooks/useAuth";
import { LoadingSpinner } from "./LoadingSpinner";
import { Card, CardContent } from "./ui/card";
import { Shield } from "lucide-react";

export const DashboardLayout: React.FC = () => {
  const { data: isAuthenticated, isLoading } = useIsAuthenticated();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  // Show authentication required message
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please log in to access the admin dashboard.
            </p>
            <button
              onClick={() => (window.location.href = "/login")}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go to Login
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Manage your Tal3a platform
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                <span>Last updated:</span>
                <span className="font-medium">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              <span>© 2025 Tal3a Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>v1.0.0</span>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-colors">
                Support
              </a>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-colors">
                Documentation
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
