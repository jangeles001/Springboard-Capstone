import * as workoutRepo from "../repositories/workoutRepo.js";
import * as workoutLogRepo from "../repositories/workoutLogRepo.js";
import * as workoutCollectionRepo from "../repositories/workoutCollectionRepo.js";
import { NotFoundError } from "../errors/NotFoundError.js";

export async function createAndLogWorkout(userPublicId, workoutData) {
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

export async function duplicateWorkout(publicId, workoutId) {
  const workout = await workoutRepo.findOneWorkoutByUUID(workoutId);
  if (!workout) throw new NotFoundError("WORKOUT");

  const collection = await workoutCollectionRepo.findWorkoutInCollectionById(
    publicId,
    workoutId,
  );

  if (collection) {
    workoutLogRepo.createOneWorkoutLogEntry({
      creatorPublicId: publicId,
      sourceWorkoutUUID: workoutId,
      workoutNameSnapshot: workout.workoutName,
      workoutDuration: workout.workoutDuration,
      exercisesSnapshot: workout.exercises,
      executedAt: new Date(),
    });
    return;
  }

  await Promise.all([
    workoutLogRepo.createOneWorkoutLogEntry({
      creatorPublicId: publicId,
      sourceWorkoutUUID: workoutId,
      workoutNameSnapshot: workout.workoutName,
      workoutDuration: workout.workoutDuration,
      exercisesSnapshot: workout.exercises,
      executedAt: new Date(),
    }),
    workoutCollectionRepo.addWorkoutToCollection(publicId, workoutId),
  ]);

  return;
}

export async function deleteWorkout(publicId, workoutId) {
  // Fetch workouts and collections entry in parallel
  const [workout, collectionEntry] = await Promise.all([
    workoutRepo.findOneWorkoutByUUID(workoutId),
    workoutCollectionRepo.findWorkoutInCollectionById(publicId, workoutId),
  ]);

  // Workout doesn't exist (only collection entry or nothing)
  if (!workout) {
    if (!collectionEntry) {
      throw new NotFoundError("WORKOUT");
    }

    // Remove from collection and mark logs as deleted in parallel
    await Promise.all([
      workoutCollectionRepo.removeOneWorkoutFromUserCollection(
        publicId,
        workoutId,
      ),
      workoutLogRepo.updateDeletedWorkoutLogStatus(workoutId, true),
    ]);
    return;
  }

  // User is NOT the creator (removing someone else's workout from their collection)
  if (workout.creatorPublicId !== publicId) {
    await Promise.all([
      workoutCollectionRepo.removeOneWorkoutFromUserCollection(
        publicId,
        workoutId,
      ),
    ]);
    return;
  }

  // User IS the creator (delete the workout itself)
  await Promise.all([
    workoutCollectionRepo.removeOneWorkoutFromUserCollection(
      publicId,
      workoutId,
    ),
    workoutCollectionRepo.updateDeletedWorkoutInCollection(workoutId, {
      creatorPublicId: workout.creatorPublicId,
      uuid: workout.uuid,
      workoutName: workout.workoutName,
      workoutDuration: workout.workoutDuration,
      exercises: workout.exercises,
    }),
    workoutRepo.deleteOneWorkoutById(workoutId),
    workoutLogRepo.updateDeletedWorkoutLogStatus(workoutId, true),
  ]);
}

export async function getWorkoutInformation(userPublicId, workoutId) {
  const log = await workoutLogRepo.findOneWorkoutLogByWorkoutId(workoutId);
  if (log && log.isDeleted) {
    const collection = await workoutCollectionRepo.findWorkoutInCollectionById(
      userPublicId,
      workoutId,
    );
    return collection[0].snapshot;
  }
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
