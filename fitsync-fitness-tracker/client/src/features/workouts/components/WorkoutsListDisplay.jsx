import { WorkoutsList } from "./WorkoutsList/index"

export function WorkoutsListDisplay(){
    return ( 
            <WorkoutsList>
                <WorkoutsList.header />
                <WorkoutsList.Body />
                <WorkoutsList.Footer />
            </WorkoutsList>
    )   
}