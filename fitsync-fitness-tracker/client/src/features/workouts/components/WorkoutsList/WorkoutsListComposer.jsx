import { WorkoutsListContext } from './WorkoutsListContext'
import { useWorkoutsList } from '../../hooks/useWorkoutsList';

export function WorkoutsListComposer({ children }){
    const workouts = useWorkoutsList({ limit: 5 });
    return (
        <WorkoutsListContext.Provider value={workouts}>
            {children}
        </WorkoutsListContext.Provider>
    )
}