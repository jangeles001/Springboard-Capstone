import * as exerciseRepo from "../repositories/exerciseRepo.js"

export async function createExercise(exerciseData){
    const newExercise = await exerciseRepo.createNewExercise(exerciseData);
    return newExercise ;
}

export async function getExercises(){
    const exercises = await exerciseRepo.findAllExercises();
    return exercises ;
}

export async function getExercise(exerciseId){
    const exercise = await exerciseRepo.findExerciseByUUID(exerciseId);
    return  exercise ;
}