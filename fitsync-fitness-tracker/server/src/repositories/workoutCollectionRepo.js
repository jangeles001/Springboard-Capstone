import { WorkoutCollection } from "../models/workoutCollectionModel.js";
import  { findAllWorkoutsByIds }  from "./workoutRepo.js";

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
    userPublicId
  })
    .skip(offset)
    .limit(pageSize)
    .lean();

  const totalCount = await WorkoutCollection.countDocuments({
    userPublicId
  });

  // Pulls workout UUIDs
  const workoutUUIDs = collectionDocs.map(doc => doc.workoutUUID);

  // Fetches actual workouts
  const workouts = await findAllWorkoutsByIds(workoutUUIDs);

  return {
    workouts,
    totalCount,
    };
}

export async function updateDeletedWorkoutInCollection(workoutUUID, updateData) {
  await WorkoutCollection.updateMany(
    {
      workoutUUID,
      isDeleted: false,
      snapshot: { $exists: false },
    },
    {
      $set: {
        snapshot: {
          workoutName: updateData.workoutName,
          workoutDuration: updateData.workoutDuration,
          exercises: updateData.exercises,
        },
      },
    }
  );
  return;
}

export async function removeOneWorkoutFromUserCollection(userPublicId, workoutUUID) {
    await WorkoutCollection.deleteOne({ userPublicId, workoutUUID });
    return;
}