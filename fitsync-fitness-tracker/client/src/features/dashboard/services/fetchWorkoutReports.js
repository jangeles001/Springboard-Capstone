import { api } from "../../../services/api";

export async function fetchWorkoutReports(range = "all"){
    const response = await api.get(`api/v1/users/reports/workouts?${range}`);
    return response?.data;
}