import { createFileRoute, Link } from "@tanstack/react-router";
import { useIsSuperAdmin, useIsOwner } from "../../hooks/useRoles";
import { useAdminRequestStats } from "../../hooks/useAdminRequests";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import {
  Shield,
  Users,
  FileText,
  BarChart,
  TrendingUp,
  Clock,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/(authenticated)/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { isSuperAdmin, isLoading: checkingSuperAdmin } = useIsSuperAdmin();
  const { isOwner, isLoading: checkingOwner, role } = useIsOwner();
  const { data: adminRequestStats } = useAdminRequestStats(isSuperAdmin);

  if (checkingSuperAdmin || checkingOwner) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  const quickActions = [
    {
      title: "Admin Requests",
      description: "Review and manage admin access requests",
      icon: FileText,
      href: "/admin-requests",
      color: "bg-blue-500",
      show: isSuperAdmin,
      badge: adminRequestStats?.pending || 0,
    },
    {
      title: "Admin Management",
      description: "Manage owners, roles, and permissions",
      icon: Shield,
      href: "/admin-management",
      color: "bg-purple-500",
      show: isSuperAdmin,
    },
    {
      title: "User Management",
      description: "Manage platform users and their data",
      icon: Users,
      href: "/users",
      color: "bg-green-500",
      show: isOwner,
    },
    {
      title: "Analytics",
      description: "View platform statistics and insights",
      icon: BarChart,
      href: "/analytics",
      color: "bg-orange-500",
      show: isOwner,
    },
  ];

  const stats = [
    {
      title: "Total Requests",
      value: adminRequestStats?.total || 0,
      icon: FileText,
      color: "text-blue-600",
      show: isSuperAdmin,
    },
    {
      title: "Pending Requests",
      value: adminRequestStats?.pending || 0,
      icon: Clock,
      color: "text-yellow-600",
      show: isSuperAdmin,
    },
    {
      title: "Approved",
      value: adminRequestStats?.approved || 0,
      icon: TrendingUp,
      color: "text-green-600",
      show: isSuperAdmin,
    },
    {
      title: "Your Role",
      value: role || "Admin",
      icon: Shield,
      color: "text-purple-600",
      show: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back! 👋</h1>
        <p className="text-gray-600 mt-2">
          {isSuperAdmin
            ? "You have full administrative access to the platform."
            : isOwner
              ? "You have owner-level access to manage users and content."
              : "You have administrative access to assigned areas."}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats
          .filter((stat) => stat.show)
          .map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions
            .filter((action) => action.show)
            .map((action) => (
              <Card
                key={action.title}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${action.color}`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 flex items-center">
                          {action.title}
                          {action.badge && action.badge > 0 && (
                            <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                              {action.badge}
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {action.description}
                        </p>
                      </div>
                    </div>
                    <Link to={action.href}>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Recent Activity (if Super Admin) */}
      {isSuperAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    System initialized successfully
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date().toLocaleString()}
                  </p>
                </div>
              </div>

              {adminRequestStats?.pending && adminRequestStats.pending > 0 && (
                <div className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {adminRequestStats.pending} admin request
                      {adminRequestStats.pending === 1 ? "" : "s"} pending
                      review
                    </p>
                    <p className="text-xs text-gray-500">
                      Requires your attention
                    </p>
                  </div>
                  <Link to="/admin-requests">
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Canister Status</p>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Database</p>
                <p className="text-xs text-gray-500">Connected</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">API</p>
                <p className="text-xs text-gray-500">Operational</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
