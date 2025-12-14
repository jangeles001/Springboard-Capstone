import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useCreatedWorkout } from "../store/WorkoutStore";
import { useWorkoutActions } from "../store/WorkoutStore";
import { api } from "../../../services/api";
import { usePublicId } from "../../../store/UserStore";

export default function useWorkouts() {
  // Store state selector
  const createdWorkout = useCreatedWorkout();
  const publicId = usePublicId();

  // Store actions selector
  const {
    setExerciseInformation,
    removeFromCreatedWorkout,
    resetCreatedWorkout,
    removeFromWorkoutsList,
  } = useWorkoutActions();

  // Local State
  const [workoutName, setWorkoutName] = useState("");
  const [nameError, setNameError] = useState(false);
  const UNIT_OPTIONS = {
    Weight: ["lbs", "kg"],
    Duration: ["min", "sec"],
  };

  const mutation = useMutation({
    mutationFn: (workout) => {
      return api.post(`api/v1/workouts/create`, workout);
    },
    onSuccess: (response) => {
      console.log(response.data.data);
      resetCreatedWorkout();
    },
    onError: (error) => {
      console.error("Error creating resource", error);
    },
  });

  // Changes the workout name
  const handleWorkoutNameChange = (e) => {
    if (nameError === true) setNameError(false);
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
    if (workoutName === "") {
      setNameError(true);
      return;
    }
    const normalizedeExercises = createdWorkout.map((exercise) => {
      return {
        exerciseId: exercise.id,
        exerciseName: exercise.translations?.[0]?.name,
        description: exercise.translations?.[0]?.description,
        reps: Number(exercise.reps) || 0,
        weight: Number(exercise.weight) || 0,
        duration: Number(exercise.duration) || 0,
      };
    });
    if (createdWorkout) {
      const workoutData = {
        workoutName,
        creatorPublicId: publicId,
        exercises: [...normalizedeExercises],
      };
      mutation.mutate(workoutData);
      resetCreatedWorkout();
      setWorkoutName("");
    }
  };

  return {
    createdWorkout,
    workoutName,
    nameError,
    UNIT_OPTIONS,
    removeFromWorkoutsList,
    handleWorkoutNameChange,
    handleExerciseInformationChange,
    handleRemove,
    handleSubmit,
  };
}
