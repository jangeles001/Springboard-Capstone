import { Exercise } from "../models/exerciseModel.js"

export async function createNewExercise(exerciseData){
    return await Exercise.create(exerciseData);
}

export async function findAllExercises(){
   return await Exercise.find({}).select("-__v -_id").lean();
}

export async function findExerciseByUUID(exerciseUUID){
    return await Exercise.findOne({ uuid: exerciseUUID });
}