import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  useCreatedWorkout,
  useFormErrors,
  useWorkoutActions,
} from "../store/WorkoutStore";
import { api } from "../../../services/api";
import { toast } from "react-hot-toast";

export default function useWorkouts() {
  // Store state selector
  const createdWorkout = useCreatedWorkout();
  const formErrors = useFormErrors();

  // Store actions selector
  const {
    setFormField,
    setExerciseInformation,
    removeFromCreatedWorkout,
    resetCreatedWorkout,
    validateCreatedWorkout,
    setFormErrors,
  } = useWorkoutActions();

  // Local State
  const UNIT_OPTIONS = {
    Weight: ["lbs"],
    Duration: ["sec"],
  };
  const [hasErrors, setHasErrors] = useState(false); // Holds value for both client and mutation errors.

  const mutation = useMutation({
    mutationFn: (workout) => {
      return api.post(`api/v1/workouts/create`, workout);
    },
    onSuccess: () => {
      resetCreatedWorkout();
      // Invalidates query cache so dashboard charts refreshes with updated data
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "workouts"],
      });

      // Invalidates query cache so workouts collections refreshes with updated data
      queryClient.invalidateQueries({
        queryKey: ["workouts"],
      });
      toast.success("Workout created successfully!");
    },
    onError: (error) => {
      toast.error("Something went wrong! Please try again later.");
    },
  });

  // Changes the value of the workout name and duration fields in the store
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormField(name, value);

    // If there is an error message for the field being updated, remove it from the formErrors state
    if (formErrors && Object.keys(formErrors).includes(name)) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleExerciseInformationChange = (e, id, field) => {
    const value = e.target.value;
    setExerciseInformation(id, { [field]: value });
  };

  // Removes exercise from create workout window
  const handleRemove = (id) => {
    removeFromCreatedWorkout(id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Runs validation logic from the store
    const { isValid } = await validateCreatedWorkout();
    if (!isValid) {
      setHasErrors(true);
      return;
    }

    const normalizedeExercises = createdWorkout.exercises.map((exercise) => {
      return {
        exerciseId: String(exercise.id),
        exerciseName: exercise.translations?.[0]?.name,
        muscles: exercise.muscles?.map(
          (muscle) => muscle.name_en || muscle.name,
        ) || [""],
        description:
          exercise.translations?.[0]?.description || "No Description Provided",
        reps: Number(exercise.reps) || 0,
        weight: Number(exercise.weight) || 0,
        duration: Number(exercise.duration) || 0,
      };
    });

    if (createdWorkout) {
      const workoutData = {
        ...createdWorkout,
        workoutDuration: Number(createdWorkout.workoutDuration),
        exercises: [...normalizedeExercises],
      };
      mutation.mutate(workoutData);
    }
  };

  return {
    createdWorkout,
    workoutName: createdWorkout.workoutName,
    workoutDuration: createdWorkout.workoutDuration,
    UNIT_OPTIONS,
    formErrors,
    handleFieldChange,
    handleExerciseInformationChange,
    handleRemove,
    handleSubmit,
  };
}
