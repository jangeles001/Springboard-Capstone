import { WorkoutsList } from "./WorkoutsList/index"

export function WorkoutsListDisplay({withRemoveButton = false}){
    return ( 
        <WorkoutsList>
            <WorkoutsList.header />
            <WorkoutsList.Body withRemoveButton={withRemoveButton} />
        </WorkoutsList>
    )   
}