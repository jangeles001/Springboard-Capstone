import { createFileRoute } from '@tanstack/react-router'
import { WorkoutsListDisplay } from "../../features/workouts/components/WorkoutsListDisplay"
import { WorkoutsList } from '../../features/workouts/components/WorkoutsList'


export const Route = createFileRoute('/dashboard/workouts')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col w-full">
      <WorkoutsListDisplay withRemoveButton={true} />
    </div>
  )
}
