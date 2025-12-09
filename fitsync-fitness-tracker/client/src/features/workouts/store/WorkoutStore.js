import { create } from "zustand";

const useWorkoutStore = create((set) => ({
  workoutsList: [],
  recentWorkouts: [],
  generatedWorkout: [],
  createdWorkout: null, // { workoutName: , exercises: }
  totalWorkouts: null, // grab total user workouts count from api.
  actions: {
    setWorkoutsList: () => {
      set({ workoutsList: [] });
    },
    removeFromWorkoutsList: (name) => {
      set((state) => ({
        workoutsList: state?.workoutsList?.filter((workout) => {
          return workout.name != name;
        }),
      }));
    },
    addToWorkoutsList: (workout) =>
      set((state) => ({
        workoutsList: [...state.workoutsList, workout],
    })),
    addToCreatedWorkout: (exercise) =>
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
