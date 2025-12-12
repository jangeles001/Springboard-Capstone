import { WorkoutsCreatorContext } from "./WorkoutsCreatorContext";
import useWorkouts  from "../../hooks/useWorkouts"

export function WorkoutsCreatorComposer({ children }) {
    const workouts = useWorkouts();
    return (
        <WorkoutsCreatorContext.Provider value={workouts}>
            <div className='flex flex-col rounded-2xl border border-gray-200 
            shadow-md bg-gray-100 md:basis-1/2 min-w-[500px] max-h-min p-5 pt-5 m-5 md:mb-20 gap-5'>
                <form className="flex flex-col gap-3" onSubmit={workouts.handleSubmit}>
                    {children}
                </form>
            </div>
        </WorkoutsCreatorContext.Provider>
    )
}