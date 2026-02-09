import { createFileRoute } from "@tanstack/react-router"
import { Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/workouts")({
  staticData: { breadcrumb: 'workouts' },
  component: () => <Outlet />,
});