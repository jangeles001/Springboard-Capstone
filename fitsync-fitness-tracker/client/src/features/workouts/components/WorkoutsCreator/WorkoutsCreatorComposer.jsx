import { WorkoutsCreatorContext } from "./WorkoutsCreatorContext";
import useWorkouts  from "../../hooks/useWorkouts"

export function WorkoutsCreatorComposer({ children }) {
    const workouts = useWorkouts();
    return (
        <WorkoutsCreatorContext.Provider value={workouts}>
            <div className='flex flex-col items-center self-auto rounded-2xl border border-gray-200 
            shadow-md bg-gray-100 min-h-[300px] min-w-[400px] max-w-[400px] p-10 pt-5 m-5 md:mt-20 md:mb-20 gap-5'>
                <form className="flex flex-col gap-3" onSubmit={workouts.handleSubmit}>
                    {children}
                </form>
            </div>
        </WorkoutsCreatorContext.Provider>
    )
}