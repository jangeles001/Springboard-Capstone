import { create } from "zustand";

const initialWorkoutData = {
  workoutName: "",
  workoutDuration: "",
  exercises: [],
};

// Validation cases
const validators = {
  workoutName: [
    (value) => (!value ? "A workout name is required!" : ""),
    (value) =>
      (value?.length < 2 ? "Workout names must be at least 2 characters!" : ""),
  ],
  workoutDuration: [
    (value) => (!value ? "Workout duration is required!" : "")],
  exercises: [
    (value) => value.length < 0 ? "Workout must have at least one exercise" : "",
  ],
};


const useWorkoutStore = create((set, get) => ({
  generatedWorkout: [],
  createdWorkout: initialWorkoutData, // { workoutName: , exercises: }
  totalWorkouts: null, // grab total user workouts count from api.
  formErrors: {},
  isValid: false,
  actions: {
    setFormField: (field, value) => 
      set((state) => ({
        createdWorkout: {
          ...state.createdWorkout,
          [field]: value
        }
      })),
    setExerciseInformation: (id, fields) => 
      set((state) => ({
        createdWorkout: {
          ...state.createdWorkout,
          exercises: state.createdWorkout.exercises.map((exercise) =>
            exercise.id === id ? { ...exercise, ...fields } : exercise
          ),
        },
    })),
    setCreatedWorkout: (workout) => set({createdWorkout: workout}),
    addExerciseToCreatedWorkout: (exercise) => {
        set((state) => ({
        createdWorkout: {
          ...state.createdWorkout,
          exercises: [...state.createdWorkout.exercises, exercise]
        },
    }))},
    removeFromCreatedWorkout: (id) =>
      set((state) => {
        if (!state.createdWorkout.exercises) return {};
        const filtered = state.createdWorkout.exercises.filter(
          (exercise) => exercise.id !== id
        );
        return { createdWorkout: { 
          ...state.createdWorkout, 
          exercises: filtered.length > 0 ? filtered : [] } };
    }),
    validateCreatedWorkout: () => {
      const { createdWorkout } = get();
      const formErrors = {};

      for (const [field, rules] of Object.entries(validators)) {
        for (const validate of rules) {
          const error = validate(createdWorkout[field]);
          if (error) {
            formErrors[field] = [...(formErrors[field] || []), error];
          }
        }
      }

      const isValid = Object.keys(formErrors)?.length === 0;

      set({ formErrors, isValid });

      return { isValid, formErrors };
    },
    resetCreatedWorkout: () => set({ createdWorkout: initialWorkoutData }),
  },
}));

//state selectors
export const useCreatedWorkoutField = (field) =>
  useWorkoutStore((state) => state.createdWorkout[field]);

export const useCreatedWorkout = () =>
  useWorkoutStore((state) => state.createdWorkout);

export const useGeneratedWorkout = () =>
  useWorkoutStore((state) => state.generatedWorkout);

export const useFormErrors = () => 
  useWorkoutStore((state) => state.formErrors);

export const useIsValid = () => 
  useWorkoutStore((state) => state.isValid);

//action selector
export const useWorkoutActions = () =>
  useWorkoutStore((state) => state.actions);
