import { useState } from "react";
import { useMutation } from "@tanstack/react-query"
import { useCreatedWorkout, useWorkoutsList } from "../store/WorkoutStore";
import { useWorkoutActions } from "../store/WorkoutStore";
import { api } from "../../../services/api";

export default function useWorkouts() {
  // Store state selector
  const workoutsList = useWorkoutsList();
  const createdWorkout = useCreatedWorkout();

  // Store actions selector
  const { removeFromCreatedWorkout, resetCreatedWorkout, removeFromWorkoutsList } =
    useWorkoutActions();

  // Local State
  const [workoutName, setWorkoutName] = useState("");
  const mutation = useMutation({
    mutationFn: (workout) => {
      return api.post(`workouts`, workout)
    },
    onSuccess: (response) => {
      console.log(response);
      resetCreatedWorkout();
    }, 
    onError: (error) => {
      console.error('Error creating resource', error);
    },
  }); 

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
      const workoutData = {...createdWorkout, workoutName: workoutName}
      mutation.mutate(workoutData);
      setWorkoutName("");
    }
  };

  return {
    createdWorkout,
    workoutsList,
    workoutName,
    removeFromWorkoutsList,
    handleChange,
    handleRemove,
    handleSubmit,
  };
}
