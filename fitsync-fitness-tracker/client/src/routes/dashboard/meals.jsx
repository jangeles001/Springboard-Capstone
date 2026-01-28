import { createFileRoute } from "@tanstack/react-router"
import { CollectionPage } from "../../components/CollectionPage/CollectionPage";
import { useMealsList } from "../../features/meals/hooks/useMealsList";
import { MealCard } from "../../features/meals/components/MealCard";
import { Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/meals")({
  component: () => <Outlet />,
});