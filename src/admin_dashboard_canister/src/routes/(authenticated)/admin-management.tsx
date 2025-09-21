import { createFileRoute } from "@tanstack/react-router";
import { AdminManagementPage } from "../../pages/AdminManagementPage";

export const Route = createFileRoute("/(authenticated)/admin-management")({
  component: AdminManagementPage,
});
