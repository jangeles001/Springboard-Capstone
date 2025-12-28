import { useContext } from "react";
import { DashboardDisplayContext } from "../components/DashboardDisplay/DashboardDisplayContext";

export const useDashboardDisplayContext = () =>
  useContext(DashboardDisplayContext);
