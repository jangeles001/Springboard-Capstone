import { Workout } from "../models/workoutModel.js";

const PRIVATE_FIELDS_EXCLUSIONS = "-_id -createdAt -updatedAt";

export async function createWorkout(workoutData) {
  const newWorkout = await Workout.create(workoutData);
  return newWorkout.toJSON();
}

export async function deleteOneWorkoutById(workoutId) {
  await Workout.deleteOne({ uuid: workoutId });
  return;
}

export async function findAllWorkouts(offset, limit) {
  const workouts = await Workout.find({})
    .skip(offset)
    .limit(limit)
    .select(PRIVATE_FIELDS_EXCLUSIONS)
    .lean();

  const totalCount = await Workout.countDocuments();

  return { workouts, totalCount };
}

export async function findWorkoutsByCreatorPublicId(
  userPublicId,
  offset,
  limit,
) {
  const workouts = await Workout.find({ creatorPublicId: userPublicId })
    .skip(offset)
    .limit(limit)
    .select(PRIVATE_FIELDS_EXCLUSIONS)
    .lean();

  const totalCount = await Workout.countDocuments({
    creatorPublicId: userPublicId,
  });

  return { workouts, totalCount };
}

export async function findOneWorkoutByUUID(workoutId) {
  const workout = await Workout.findOne({ uuid: workoutId });
  return workout.toJSON();
}

export async function findAllWorkoutsByIds(workoutIds) {
  const workouts = await Workout.find({ uuid: { $in: workoutIds } })
    .select(PRIVATE_FIELDS_EXCLUSIONS)
    .lean();
  return workouts;
}

export async function duplicateOneWorkoutByUUID(workoutId) {
  return;
}
