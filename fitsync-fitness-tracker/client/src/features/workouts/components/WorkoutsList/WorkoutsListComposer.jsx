import { WorkoutsListContext } from './WorkoutsListContext'
import useWorkouts from "../../hooks/useWorkouts"

export function WorkoutsListComposer({ children }){
    const workouts = useWorkouts();
    return (
        <WorkoutsListContext.Provider value={workouts}>
            {children}
        </WorkoutsListContext.Provider>
    )
}