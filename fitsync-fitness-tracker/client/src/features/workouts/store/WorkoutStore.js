import { create } from "zustand";
import { removeKey } from "../../../utils/stateHelpers";

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
      value?.length < 4 ? "Workout names must be at least 4 characters!" : "",
  ],
  workoutDuration: [(value) => (!value ? "Workout duration is required!" : "")],
  exercises: [
    (value) =>
      value.length < 1 ? "Workout must have at least one exercise" : "",
    (value) => {
      for (const exercise of value) {
        if (!exercise.reps || exercise.reps < 1) {
          return "One or more exercises is missing reps";
        }
      }
      return "";
    },
    (value) => {
      for (const exercise of value) {
        const isBodyWeight = exercise.equipment.some(
          (equipment) => equipment.id === 7,
        );
        if (
          !isBodyWeight &&
          (!exercise?.measurement || exercise?.measurement <= 0)
        ) {
          return "Each exercise must have either weight or duration";
        }
      }
      return "";
    },
  ],
};

const useWorkoutStore = create((set, get) => ({
  generatedWorkout: [],
  createdWorkout: initialWorkoutData, // { workoutName: , exercises: }
  formErrors: {},
  isValid: false,

  actions: {
    setFormField: (field, value) => {
      set((state) => ({
        createdWorkout: {
          ...state.createdWorkout,
          [field]: value,
        },
      }));

      const { formErrors, actions } = get();
      if (field in formErrors) {
        actions.setFormErrors((prev) => removeKey(prev, field));
      }
    },
    // Sets formErrors state via updater function or direct value
    setFormErrors: (updater) =>
      set((state) => ({
        formErrors:
          typeof updater === "function" ? updater(state.formErrors) : updater,
      })),
    setExerciseInformation: (id, fields) => {
      set((state) => ({
        createdWorkout: {
          ...state.createdWorkout,
          exercises: state.createdWorkout.exercises.map((exercise) =>
            exercise.id === id ? { ...exercise, ...fields } : exercise,
          ),
        },
      }));

      const { formErrors, actions } = get();

      if (formErrors?.exercises) {
        actions.setFormErrors((prev) => removeKey(prev, "exercises"));
      }
    },
    setCreatedWorkout: (workout) => set({ createdWorkout: workout }),
    addExerciseToCreatedWorkout: (exercise) => {
      set((state) => ({
        createdWorkout: {
          ...state.createdWorkout,
          exercises: [...state.createdWorkout.exercises, exercise],
        },
      }));

      const { formErrors, actions } = get();

      if (formErrors?.exercises) {
        actions.setFormErrors((prev) => removeKey(prev, "exercises"));
      }
    },
    removeFromCreatedWorkout: (id) =>
      set((state) => {
        if (!state.createdWorkout.exercises) return {};
        const filtered = state.createdWorkout.exercises.filter(
          (exercise) => exercise.id !== id,
        );

        const { formErrors, actions } = get();

        if (formErrors?.exercises) {
          actions.setFormErrors((prev) => removeKey(prev, "exercises"));
        }
        return {
          createdWorkout: {
            ...state.createdWorkout,
            exercises: filtered.length > 0 ? filtered : [],
          },
        };
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

      return { isValid };
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

export const useFormErrors = () => useWorkoutStore((state) => state.formErrors);

export const useIsValid = () => useWorkoutStore((state) => state.isValid);

//action selector
export const useWorkoutActions = () =>
  useWorkoutStore((state) => state.actions);
