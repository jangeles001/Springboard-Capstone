import { createFileRoute } from '@tanstack/react-router'
import Workouts from '../../features/workouts/components/workouts'
import { useWorkoutStore } from "../../features/workouts/store/WorkoutStore"


export const Route = createFileRoute('/dashboard/workouts')({
  component: RouteComponent,
})

function RouteComponent() {

  const workoutsList = useWorkoutStore((state) => state.workoutsList)   
  const removeFromWorkoutsList  = useWorkoutStore((state) => state.removeFromWorkoutsList);

  return (
  <div>
    <Workouts workouts={workoutsList} onRemoveWorkout={removeFromWorkoutsList} />
  </div>
  )
}
