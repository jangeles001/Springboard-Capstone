import { createFileRoute } from '@tanstack/react-router'
import { useWorkoutsList } from '../../features/workouts/hooks/useWorkoutsList'
import { WorkoutCard } from '../../features/workouts/components/WorkoutCard'
import { CollectionPage } from '../../components/CollectionPage/CollectionPage'


export const Route = createFileRoute('/dashboard/workouts')({
  component: () => {
    return <CollectionPage
    hook={useWorkoutsList}
    CardComponent={WorkoutCard}
    titlePersonal="Your Workouts"
    titleAll="All Workouts"
    emptyText="No workouts created yet."
    dataKey="workouts"
    />
  },
})