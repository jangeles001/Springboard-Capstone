import { createFileRoute } from '@tanstack/react-router'
import { WorkoutBuilderPage } from '../../features/workouts/pages/WorkoutBuilderPage'

export const Route = createFileRoute('/dashboard/workout-builder')({
  component: WorkoutBuilderPage,
})
