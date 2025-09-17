import { createFileRoute } from '@tanstack/react-router'
import Workouts from '../../features/workouts/components/workouts'
import { useWorkoutsList, useWorkoutActions } from "../../features/workouts/store/WorkoutStore"


export const Route = createFileRoute('/dashboard/workouts')({
  component: RouteComponent,
})

function RouteComponent() {

  const workoutsList = useWorkoutsList();  
  const { removeFromWorkoutsList }  = useWorkoutActions();

  return (
  <div>
    {console.log(workoutsList)}
    <Workouts workouts={workoutsList} onRemoveWorkout={removeFromWorkoutsList} />
  </div>
  )
}
