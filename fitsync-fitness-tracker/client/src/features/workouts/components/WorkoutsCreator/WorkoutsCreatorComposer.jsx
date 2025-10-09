import { WorkoutsCreatorContext } from "./WorkoutsCreatorContext";
import { useExercises } from "../../../../hooks/useExercises"

export function WorkoutsCreatorComposer({ children }) {
    const exercises = useExercises();
    return (
        <WorkoutsCreatorContext.Provider value={exercises}>
            <div className='flex flex-col items-center self-auto rounded-2xl border border-gray-200 
            shadow-md bg-gray-100 min-h-[300px] min-w-[400px] pt-5 m-10 md:mt-20 md:mb-20 gap-5'>
                {children}
            </div>
        </WorkoutsCreatorContext.Provider>
    )
}