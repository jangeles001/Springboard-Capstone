import { WorkoutsBuilderContext } from "./WorkoutsBuilderContext";
import useWorkouts  from "../../hooks/useWorkouts"

export function WorkoutsBuilderComposer({ children }) {
    const workouts = useWorkouts();
    return (
        <WorkoutsBuilderContext.Provider value={workouts}>
          <div className="flex h-min flex-col rounded-2xl border bg-white shadow-sm">

            <form
              onSubmit={workouts?.handleSubmit}
              className="flex flex-1 flex-col gap-6 p-6"
            >
              {children}
            </form>

          </div>
        </WorkoutsBuilderContext.Provider>
    );
}