import { Exercise } from "../models/ExerciseModel.js"

export async function createNewExercise(exerciseData){
    const exercise = await Exercise.create(exerciseData);
    return exercise.toJSON();
}

export async function findAllExercises(){
   return await Exercise.find({}).select("-__v -_id").lean();
}

export async function findExerciseByUUID(exerciseId){
    const exercise = await Exercise.findOne({ exerciseId: exerciseId });
    return exercise.toJSON();
}