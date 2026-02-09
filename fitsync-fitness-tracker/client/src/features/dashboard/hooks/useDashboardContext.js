import { useContext } from "react";
import { DashboardDisplayContext } from "../components/DashboardDisplay/DashboardDisplayContext";

// Custom hook to access the dashboard display context
export const useDashboardDisplayContext = () =>
  useContext(DashboardDisplayContext);
