import * as workoutRepo from "../repositories/workoutRepo.js";

export async function createWorkout(workoutData){
    const newWorkout = await workoutRepo.createWorkout(workoutData);
    return newWorkout;
}

export async function getWorkoutInformation(workoutId){
    const workoutInformation = await workoutRepo.findWorkoutByWorkoutId(workoutId);
    return workoutInformation;
}

export async function getAllWorkouts(){
    const workouts = await workoutRepo.findAllWorkouts();
    return workouts;
}
