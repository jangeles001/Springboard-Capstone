import { WorkoutCollection } from "../models/workoutCollectionModel.js";
import { findAllWorkoutsByIds } from "./workoutRepo.js";

export async function findWorkoutInCollectionById(userPublicId, workoutUUID) {
  return await WorkoutCollection.find({
    userPublicId,
    workoutUUID,
  }).lean();
}

export async function addWorkoutToCollection(userPublicId, workoutUUID) {
  const newEntry = await WorkoutCollection.create({
    userPublicId,
    workoutUUID,
  });
  return newEntry.toJSON();
}

export async function findWorkoutsInCollectionByUserPublicId(
  userPublicId,
  offset = 0,
  pageSize = 10,
) {
  // Fetches collection docs
  const collectionDocs = await WorkoutCollection.find({
    userPublicId,
  })
    .skip(offset)
    .limit(pageSize)
    .lean();

  const totalCount = await WorkoutCollection.countDocuments({
    userPublicId,
  });

  return {
    collectionDocs,
    totalCount,
  };
}

export async function updateDeletedWorkoutInCollection(
  workoutUUID,
  updateData,
) {
  await WorkoutCollection.updateMany(
    {
      workoutUUID,
      isDeleted: false,
      snapshot: { $exists: false },
    },
    {
      $set: {
        isDeleted: true,
        snapshot: {
          creatorPublicId: updateData.creatorPublicId,
          uuid: updateData.uuid,
          workoutName: updateData.workoutName,
          workoutDuration: updateData.workoutDuration,
          exercises: updateData.exercises,
        },
      },
    },
  );
  return;
}

export async function removeOneWorkoutFromUserCollection(
  userPublicId,
  workoutUUID,
) {
  await WorkoutCollection.deleteOne({ userPublicId, workoutUUID });
  return;
}
