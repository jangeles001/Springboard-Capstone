import * as exerciseService from "../services/exerciseService.js";

export async function createExerciseController(req, res) {
  try {
    const exerciseData = req.body;
    const newExercise = await exerciseService.createExercise(exerciseData);
    return res.generateSuccessResponse(
      newExercise,
      "Exercise Created Successfully!",
      201,
    );
  } catch (error) {
    return res.generateErrorResponse(error.message, error.statusCode);
  }
}

export async function getExercisesController(req, res) {
  try {
    const exercises = await exerciseService.getExercises();
    return res.generateSuccessResponse(exercises, null, 200);
  } catch (error) {
    return res.generateErrorResponse(error.message, error.statusCode);
  }
}

export async function getExerciseController(req, res) {
  try {
    const exerciseId = req.params.exerciseId;
    const exercise = await exerciseService.getExercise(exerciseId);
    return res.generateSuccessResponse(exercise, null, 200);
  } catch (error) {
    return res.generateErrorResponse(error.message, error.statusCode);
  }
}
