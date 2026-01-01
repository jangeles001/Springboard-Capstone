import { WorkoutsCreatorContext } from "./WorkoutsCreatorContext";
import useWorkouts  from "../../hooks/useWorkouts"

export function WorkoutsCreatorComposer({ children }) {
    const workouts = useWorkouts();
    return (
        <WorkoutsCreatorContext.Provider value={workouts}>
            <div className='flex flex-col flex-1 rounded-2xl border shadow-md bg-gray-100 p-5 gap-5'>
                <form className="flex flex-col gap-3" onSubmit={workouts.handleSubmit}>
                    {children}
                </form>
            </div>
        </WorkoutsCreatorContext.Provider>
    )
}