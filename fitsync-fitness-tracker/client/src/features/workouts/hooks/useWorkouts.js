import { useMutation } from "@tanstack/react-query";
import { useCreatedWorkout, useFormErrors, useWorkoutActions } from "../store/WorkoutStore";
import { api } from "../../../services/api";
import { usePublicId } from "../../../store/UserStore";

export default function useWorkouts() {
  // Store state selector
  const createdWorkout = useCreatedWorkout();
  const formErrors = useFormErrors();
  const publicId = usePublicId();

  // Store actions selector
  const {
    setFormField,
    setExerciseInformation,
    removeFromCreatedWorkout,
    resetCreatedWorkout,
    validateCreatedWorkout
  } = useWorkoutActions();

  // Local State
  const UNIT_OPTIONS = {
    Weight: ["lbs"],
    Duration: ["sec"],
  };

  const mutation = useMutation({
    mutationFn: (workout) => {
      return api.post(`api/v1/workouts/create`, workout);
    },
    onSuccess: () => {
      resetCreatedWorkout();
    },
    onError: (error) => {
      console.error("Error creating resource", error);
    },
  });

  // Changes the workout name
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormField(name, value);
    if (Object.keys(formErrors).includes(name)) delete formErrors[name];
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
    if(!createdWorkout.exercises) return; 
      
    const { isValid } = validateCreatedWorkout();
    if(!isValid) return;

    const normalizedeExercises = createdWorkout.exercises.map((exercise) => {
      return {
        exerciseId: exercise.id,
        exerciseName: exercise.translations?.[0]?.name,
        muscles: exercise.muscles?.map((muscle) => muscle.name_en || muscle.name) || [""],
        description: exercise.translations?.[0]?.description || "No Description Provided",
        reps: Number(exercise.reps) || 0,
        weight: Number(exercise.weight) || 0,
        duration: Number(exercise.duration) || 0,
      };
    });

    console.log(normalizedeExercises)

    if (createdWorkout) {
      const workoutData = {
        creatorPublicId: publicId,
        ...createdWorkout,
        exercises: [...normalizedeExercises],
      };
      mutation.mutate(workoutData);
      resetCreatedWorkout();
    }
  };

  return {
    createdWorkout,
    workoutName: createdWorkout.workoutName,
    workoutDuration: createdWorkout.workoutDuration,
    UNIT_OPTIONS,
    handleFieldChange,
    handleExerciseInformationChange,
    handleRemove,
    handleSubmit,
  };
}
