import { useState } from 'react';
import { useCreatedWorkout } from '../store/WorkoutStore';
import { useWorkoutActions } from '../store/WorkoutStore';

export default function useWorkouts() {
  // Store state slice selector
  const createdWorkout  = useCreatedWorkout();
    
  // Store actions selector
  const {  
    removeFromCreatedWorkout, 
    createWorkout, 
  } = useWorkoutActions();

	// Local State
	const [workoutName, setWorkoutName] = useState("");

  // Changes the workout name
  const handleChange = (e) => {
    setWorkoutName(e.target.value);
  };

	// Removes exercise from create workout window
  const handleRemove = (id) => {
    removeFromCreatedWorkout(id);
  };

	const handleSubmit = (e) => {
    e.preventDefault();
    if (createdWorkout) {
      createWorkout(workoutName);
      setWorkoutName("");
    }
  };
    
    return {
			createdWorkout,
      workoutName,
      handleChange,
			handleRemove,
			handleSubmit
    }
}