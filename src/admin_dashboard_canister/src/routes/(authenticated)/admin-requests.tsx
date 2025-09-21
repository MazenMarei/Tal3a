import { createFileRoute } from "@tanstack/react-router";
import { AdminRequestManager } from "../../components/AdminRequestManager";

export const Route = createFileRoute("/(authenticated)/admin-requests")({
  component: AdminRequestManager,
});
