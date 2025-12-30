import { WorkoutsListContext } from './WorkoutsListContext'
import { useWorkoutsList } from '../../hooks/useWorkoutsList';

export function WorkoutsListComposer({ children }){
    const workouts = useWorkoutsList({ limit: 10 });
    return (
        <div className="flex flex-col w-full">
            <WorkoutsListContext.Provider value={workouts}>
                {children}
            </WorkoutsListContext.Provider>
        </div>
    )
}