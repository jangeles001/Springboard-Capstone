import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/workouts')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/workouts"!</div>
}
