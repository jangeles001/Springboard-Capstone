import * as workoutService from "../services/workoutService.js";

export async function createWorkoutController(req, res) {
  try {
    const workoutData = req.body;
    const newWorkout = await workoutService.createWorkout(workoutData);
    return res.generateSuccessResponse(newWorkout, "Workout Created!", 201);
  } catch (error) {
    return res.generateErrorResponse(error.message, error.statusCode);
  }
}

export async function getAllWorkoutsController(req, res) {
  const workouts = [
    { id: 1, name: "Push-ups", reps: 20 },
    { id: 2, name: "Squats", reps: 15 },
  ];
  return res.status(200).json(workouts);
}
