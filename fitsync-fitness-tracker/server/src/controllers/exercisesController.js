import * as exerciseService from "../services/exerciseService.js"

export async function createExerciseController(req, res){
    try{
        const exerciseData = req.body;
        const newExercise = await exerciseService.createExercise(exerciseData)
        return res.status(200).json({ newExercise });
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

export async function getExercisesController(req, res){
    try{
        const exercises = await exerciseService.getExercises();
        return res.status(200).json({ exercises });
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

export async function getExerciseController(req, res){
    try{
        const { exerciseUUID } = req.params;
        const exercise = await exerciseService.getExercise(exerciseUUID);
        return res.status(200),json({ exercise }); 
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}