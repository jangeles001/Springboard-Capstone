import { create } from "zustand";

const useWorkoutStore = create((set) => ({
  recentWorkouts: [],
  generatedWorkout: [],
  createdWorkout: null, // { workoutName: , exercises: }
  totalWorkouts: null, // grab total user workouts count from api.
  actions: {
    setExerciseInformation: (id, fields) =>
      set((state) => {
        const newMap = state.createdWorkout.map((ex) =>
          ex.id === id ? { ...ex, ...fields } : ex
        );

        return { createdWorkout: newMap };
      }),
    addExerciseToCreatedWorkout: (exercise) =>
      set((state) => ({
        createdWorkout: state.createdWorkout
          ? [...state.createdWorkout, exercise]
          : [exercise],
      })),
    removeFromCreatedWorkout: (id) =>
      set((state) => {
        if (!state.createdWorkout) return {};
        const filtered = state.createdWorkout.filter(
          (exercise) => exercise.id !== id
        );
        return { createdWorkout: filtered.length > 0 ? filtered : null };
      }),
    resetCreatedWorkout: () => set({ createdWorkout: null }),
  },
}));

//state selectors
export const useWorkoutsList = () =>
  useWorkoutStore((state) => state.workoutsList);

export const useCreatedWorkout = () =>
  useWorkoutStore((state) => state.createdWorkout);

export const useGeneratedWorkout = () =>
  useWorkoutStore((state) => state.generatedWorkout);

//action selector
export const useWorkoutActions = () =>
  useWorkoutStore((state) => state.actions);
