import { create } from 'zustand'

export const useWorkoutStore = create((set, get) => ({
    workoutsList: [],
    recentWorkouts: [],
    generatedWorkout: [],
    createdWorkout: null,
    setWorkoutsList: () => {
        const response = [""] // call fetch from fetching service
        set({workoutsList: [],})
    },
    removeFromWorkoutsList: (id) => set((state) => ({ 
        workoutsList: state?.workoutsList.filter((workout) => {
            return workout.id != id
        }),
    })),
    addToWorkoutsList: (workout) =>
        set((state) => ({ 
            workoutsList: [...state.workoutsList, workout]
        })),
    addToCreatedWorkout: (exercise) => set((state) => ({
        createdWorkout: state.createdWorkout 
        ? [...state.createdWorkout, exercise] : [exercise],
    })),
    removeFromCreatedWorkout: (id) =>
        set((state) => {
            if (!state.createdWorkout) return {};
            const filtered = state.createdWorkout.filter((exercise) => exercise.id !== id);
            return { createdWorkout: filtered.length > 0 ? filtered : null };
        }),
    resetCreatedWorkout: () => set({ createdWorkout: null }),
    createWorkout: () => {
        const state = get();
        if (!state.createdWorkout) return;
        set((prevState) => ({ 
            workoutsList: state.workoutsList
            ? [...prevState.workoutsList, state.createdWorkout] 
            : [state.createdWorkout]
        }))
    get().resetCreatedWorkout();
    },
}));