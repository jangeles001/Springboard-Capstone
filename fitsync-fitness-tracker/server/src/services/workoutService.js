import * as workoutRepo from "../repositories/workoutRepo.js";
import * as workoutLogRepo from "../repositories/workoutLogRepo.js";
import * as workoutCollectionRepo from "../repositories/workoutCollectionRepo.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";

export async function createAndLogWorkout(userPublicId, workoutData) {
  // Verifies user is trying to create workout as their own account
  if (userPublicId !== workoutData.creatorPublicId)
    throw new UnauthorizedError();

  // Create the workout template
  const newWorkout = await workoutRepo.createWorkout({
    ...workoutData,
    creatorPublicId: userPublicId,
  });

  // Add to collection and create log in parallel
  await Promise.all([
    workoutCollectionRepo.addWorkoutToCollection(userPublicId, newWorkout.uuid),
    workoutLogRepo.createOneWorkoutLogEntry({
      creatorPublicId: userPublicId,
      sourceWorkoutUUID: newWorkout.uuid,
      workoutNameSnapshot: newWorkout.workoutName,
      workoutDuration: newWorkout.workoutDuration,
      exercisesSnapshot: newWorkout.exercises,
      executedAt: new Date(),
    }),
  ]);

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
