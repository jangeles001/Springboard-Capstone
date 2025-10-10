import { createFileRoute } from '@tanstack/react-router'
import WorkoutsList from '../../features/workouts/components/WorkoutsList';


export const Route = createFileRoute('/dashboard/workouts')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
  <div>
    <WorkoutsList />
  </div>
  )
}
