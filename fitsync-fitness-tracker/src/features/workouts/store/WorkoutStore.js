import { create } from "zustand";

const useWorkoutStore = create((set, get) => ({
  workoutsList: [],
  recentWorkouts: [],
  generatedWorkout: [],
  createdWorkout: null,
  actions: {
    setWorkoutsList: () => {
      const response = [""]; // call fetch from fetching service
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
    createWorkout: (name) => {
      //create random name geneartor to call if name of workout is blank.
      const state = get();
      if (!state.createdWorkout) return;
      const newWorkout = {
        name: name || "TBA",
        workouts: [...state.createdWorkout],
      };
      set((prevState) => ({
        workoutsList: state.workoutsList
          ? [...prevState.workoutsList, newWorkout]
          : [newWorkout],
        createdWorkout: null,
      }));
    },
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
