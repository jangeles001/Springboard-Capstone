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

export async function getWorkoutInformationController(req, res){
  try{
    const workoutId = req.params.workoutId;
    const workoutInformation = await workoutService.getWorkoutInformation(workoutId);
    return res.generateSuccessResponse(workoutInformation, "Success!", 200);
  }catch(error){
    return res.generateErrorResponse(error.message, error.statusCode);
  }

}

export async function getAllWorkoutsController(req, res) {
  try{
    const workouts = await workoutService.getAllWorkouts();
    return res.generateSuccessResponse(workouts, "Success!", 200);
  }catch(error){
    return res.generateErrorResponse(error.message, error.statusCode);
  }

}
