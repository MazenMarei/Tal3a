import { createFileRoute } from "@tanstack/react-router";
import AdminRequestForm from "../components/AdminRequestForm";

export const Route = createFileRoute("/request-access")({
  component: () => (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-light to-secondary/5 p-4">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Request Admin Access
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Request administrative access to the Tal3a platform. Your request
            will be reviewed by a super admin.
          </p>
        </div>

        <AdminRequestForm />
      </div>
    </div>
  ),
});
