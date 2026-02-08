import { createFileRoute } from '@tanstack/react-router'
import { WorkoutCollectionPage } from '../../features/workouts/pages/WorkoutCollectionPage'


export const Route = createFileRoute('/dashboard/workouts/')({
  component: WorkoutCollectionPage,
})