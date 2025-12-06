import { Workout } from "../models/workoutModel.js"

export async function createWorkout(workoutData){
    const newWorkout = await Workout.create(workoutData);
    return newWorkout.toJSON();
}

export async function findAllWorkouts(){
    return await Workout.find({}).select("-__v -_id -updatedAt").lean();
}

export async function findWorkoutsByCreatorPublicId(userPublicId){
    return await Workout.find({ creatorPublicId: userPublicId }).select("-__v -_id -updatedAt").lean();
}

export async function findWorkoutByWorkoutId(workoutId){
    const workout = await Workout.findOne({ uuid: workoutId });
    return workout.toJSON();
}