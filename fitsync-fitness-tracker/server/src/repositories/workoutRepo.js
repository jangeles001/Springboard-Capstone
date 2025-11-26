import { Workout } from "../models/workoutModel.js"

export async function createWorkout(workoutData){
    return await Workout.create(workoutData);
}

export async function findWorkoutsByCreatorPublicId(userPublicId){
    return await Workout.find({ creatorPublicId: userPublicId });
}