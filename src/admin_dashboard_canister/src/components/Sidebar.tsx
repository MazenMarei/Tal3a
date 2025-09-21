/**
 * Sidebar Navigation Component for Admin Dashboard
 *
 * Provides responsive sidebar with role-based navigation items
 */

import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  useIsSuperAdmin,
  useIsOwner,
  useUserRole,
  useCurrentOwner,
} from "../hooks/useRoles";
import { useLogout } from "../hooks/useAuth";
import { Button } from "./ui/button";
import {
  Shield,
  Users,
  FileText,
  BarChart,
  Settings,
  Menu,
  X,
  Home,
  UserCog,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { cn } from "../lib/utils";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  description: string;
  requiredRole?: "SuperAdmin" | "Admin" | "Owner";
  requiredPermission?: string;
  badge?: string;
  children?: NavigationItem[];
}

const navigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    href: "/dashboard",
    description: "Overview and quick actions",
  },
  {
    id: "admin-requests",
    label: "Admin Requests",
    icon: FileText,
    href: "/admin-requests",
    description: "Manage admin access requests",
    requiredRole: "SuperAdmin",
    badge: "New",
  },
  {
    id: "admin-management",
    label: "Admin Management",
    icon: UserCog,
    href: "/admin-management",
    description: "Manage owners and roles",
    requiredRole: "SuperAdmin",
  },
  {
    id: "users",
    label: "User Management",
    icon: Users,
    href: "/users",
    description: "Manage platform users",
    requiredPermission: "ManageUsers",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart,
    href: "/analytics",
    description: "View platform statistics",
    requiredPermission: "ViewAnalytics",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/settings",
    description: "System configuration",
    requiredPermission: "SystemConfiguration",
  },
];

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [routerState, setRouterState] = useState("");
  const { data: currentOwner } = useCurrentOwner();
  const { isSuperAdmin } = useIsSuperAdmin();
  const { isOwner, role } = useIsOwner();
  const { permissions } = useUserRole();
  const logout = useLogout();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const hasPermission = (item: NavigationItem): boolean => {
    // Check role requirements
    if (item.requiredRole) {
      if (item.requiredRole === "SuperAdmin" && !isSuperAdmin) {
        return false;
      }
      if (item.requiredRole === "Owner" && !isOwner) {
        return false;
      }
    }

    // Check permission requirements
    if (item.requiredPermission) {
      return permissions.includes(item.requiredPermission);
    }

    return true;
  };

  const filteredItems = navigationItems.filter(hasPermission);

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">Tal3a Admin</h1>
              <p className="text-xs text-gray-500">{role || "Admin"}</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleCollapse}
          className="p-2"
        >
          {isCollapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredItems.map((item) => (
          <div key={item.id}>
            <Link
              to={item.href}
              onClick={() => setRouterState(item.href)}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                "hover:bg-gray-100 hover:text-gray-900",
                "focus:outline-none focus:ring-2 focus:ring-primary/20",
                routerState === item.href
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-gray-600",
                isCollapsed ? "justify-center" : ""
              )}
            >
              <item.icon
                className={cn(
                  "flex-shrink-0",
                  isCollapsed ? "h-5 w-5" : "h-4 w-4"
                )}
              />

              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {item.children && <ChevronDown className="h-4 w-4" />}
                </>
              )}
            </Link>

            {/* Submenu */}
            {item.children && !isCollapsed && (
              <div className="mt-2 ml-4 space-y-1">
                {item.children.filter(hasPermission).map((child) => (
                  <Link
                    key={child.id}
                    to={child.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md text-sm",
                      "hover:bg-gray-50 text-gray-600"
                    )}
                  >
                    <child.icon className="h-3 w-3" />
                    <span>{child.label}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-16 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                {item.label}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-900"></div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div className="border-t border-gray-200 p-4">
        {!isCollapsed && (
          <div className="mb-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {currentOwner?.name || "Owner Name"}
                </p>
                <p className="text-xs text-gray-500">
                  {role || "Administrator"}
                </p>
              </div>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          disabled={logout.isPending}
          className={cn(
            "w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100",
            isCollapsed ? "px-2" : "px-3"
          )}
        >
          <LogOut
            className={cn(
              "flex-shrink-0",
              isCollapsed ? "h-5 w-5" : "h-4 w-4 mr-2"
            )}
          />
          {!isCollapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
