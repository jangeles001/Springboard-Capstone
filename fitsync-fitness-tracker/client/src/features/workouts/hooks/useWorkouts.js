import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useCreatedWorkout, useWorkoutsList } from "../store/WorkoutStore";
import { useWorkoutActions } from "../store/WorkoutStore";
import { api } from "../../../services/api";

export default function useWorkouts() {
  // Store state selector
  const workoutsList = useWorkoutsList();
  const createdWorkout = useCreatedWorkout();

  // Store actions selector
  const {
    setExerciseInformation,
    removeFromCreatedWorkout,
    resetCreatedWorkout,
    removeFromWorkoutsList,
  } = useWorkoutActions();

  // Local State
  const [workoutName, setWorkoutName] = useState("");
  const UNIT_OPTIONS = {
    Weight: ["lbs", "kg"],
    Duration: ["min", "sec"],
  };

  const mutation = useMutation({
    mutationFn: (workout) => {
      return api.post(`workouts`, workout);
    },
    onSuccess: (response) => {
      console.log(response);
      resetCreatedWorkout();
    },
    onError: (error) => {
      console.error("Error creating resource", error);
    },
  });

  // Changes the workout name
  const handleWorkoutNameChange = (e) => {
    setWorkoutName(e.target.value);
  };

  const handleExerciseInformationChange = (e, id, field) => {
    const value = e.target.value;
    setExerciseInformation(id, { [field]: value });
  };

  // Removes exercise from create workout window
  const handleRemove = (id) => {
    removeFromCreatedWorkout(id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (createdWorkout) {
      const workoutData = { ...createdWorkout, workoutName: workoutName };
      mutation.mutate(workoutData);
      setWorkoutName("");
    }
  };

  return {
    createdWorkout,
    workoutsList,
    workoutName,
    UNIT_OPTIONS,
    handleWorkoutNameChange,
    removeFromWorkoutsList,
    handleExerciseInformationChange,
    handleRemove,
    handleSubmit,
  };
}
