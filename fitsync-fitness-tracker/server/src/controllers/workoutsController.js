import * as workoutService from "../services/workoutService.js";

export async function createWorkoutController(req, res) {
  try {
    const workoutData = req.body;
    const { publicId: userPublicId } = req.user;
    const newWorkout = await workoutService.createAndLogWorkout(
      userPublicId,
      workoutData,
    );
    return res.generateSuccessResponse(newWorkout, "Workout Created!", 201);
  } catch (error) {
    return res.generateErrorResponse(error.message, error.statusCode);
  }
}

export async function duplicateWorkoutController(req, res) {
  try {
    const { workoutId } = req.params;
    const { publicId } = req.user;
    await workoutService.duplicateWorkout(publicId, workoutId);
    return res.generateSuccessResponse(
      null,
      "Workout Duplicated Successfully!",
      201,
    );
  } catch (error) {
    return res.generateErrorResponse(error.message, error.statusCode);
  }
}

export async function deleteWorkoutController(req, res) {
  try {
    const { workoutId } = req.params;
    const { publicId } = req.user;
    await workoutService.deleteWorkout(publicId, workoutId);
    return res.generateSuccessResponse(
      null,
      "Workout Deleted Successfully!",
      200,
    );
  } catch (error) {
    return res.generateErrorResponse(error.message, error.statusCode);
  }
}

export async function getWorkoutInformationController(req, res) {
  try {
    const { workoutId } = req.params;
    const { publicId } = req.user;
    const workoutInformation = await workoutService.getWorkoutInformation(
      publicId,
      workoutId,
    );
    console.log(workoutInformation);
    return res.generateSuccessResponse(workoutInformation, "Success!", 200);
  } catch (error) {
    console.log(error);
    return res.generateErrorResponse(error.message, error.statusCode);
  }
}

export async function getAllWorkoutsController(req, res) {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const workouts = await workoutService.getAllWorkouts(offset, pageSize);
    return res.generateSuccessResponse(workouts, "Success!", 200);
  } catch (error) {
    return res.generateErrorResponse(error.message, error.statusCode);
  }
}
