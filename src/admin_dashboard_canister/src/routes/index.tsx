import { createFileRoute, redirect } from "@tanstack/react-router";
import { getCurrentUser, isAuthenticated } from "@/lib/auth";
export const Route = createFileRoute("/")({
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
    } else {
      throw redirect({ to: "/login" });
    }
  },
});
