import * as workoutRepo from "../repositories/workoutRepo.js";
import * as workoutLogRepo from "../repositories/workoutLogRepo.js";
import * as workoutCollectionRepo from "../repositories/workoutCollectionRepo.js";

export async function createWorkout(workoutData) {
  const newWorkout = await workoutRepo.createWorkout(workoutData);
  const workoutLogData = {
    creatorPublicId: newWorkout.creatorPublicId,
    sourceWorkoutUUID: newWorkout.uuid,
    workoutNameSnapshot: newWorkout.workoutName,
    workoutDuration: newWorkout.workoutDuration,
    exercisesSnapshot: newWorkout.exercises,
    executedAt: new Date(),
  };
  await workoutLogRepo.createOneWorkoutLogEntry(workoutLogData);
  await workoutCollectionRepo.addWorkoutToCollection(
    newWorkout.creatorPublicId,
    newWorkout.uuid,
  );
  
  return newWorkout;
}

export async function getWorkoutInformation(workoutId) {
  const workoutInformation = await workoutRepo.findOneWorkoutByUUID(workoutId);
  return workoutInformation;
}

export async function getAllWorkouts(offset = 0, pageSize = 10) {
  let hasNextPage = false;
  let hasPreviousPage = false;
  const { workouts, totalCount } = await workoutRepo.findAllWorkouts(
    offset,
    pageSize,
  );

  if (offset + pageSize < totalCount - 1) hasNextPage = true;

  if (offset > 0) hasPreviousPage = true;

  return { workouts, hasPreviousPage, hasNextPage };
}
