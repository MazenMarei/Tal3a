import { createFileRoute, redirect } from "@tanstack/react-router";
import { getCurrentUser, isAuthenticated } from "@/lib/auth";
import { LoginPage } from "@/components/LoginPage";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  beforeLoad: async () => {
    if (await isAuthenticated()) {
      // check the role and user data from backend
      const user = await getCurrentUser();
      if (!user) {
        throw redirect({ to: "/request-access" });
      }

      if ("Err" in user) {
        if (user.Err.code === 404) {
          throw redirect({ to: "/request-access" });
        }
      } else {
        throw redirect({ to: "/dashboard" });
      }
    }
  },
});
