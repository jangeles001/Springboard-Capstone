import { useWorkoutsList } from '../hooks/useWorkoutsList'
import { WorkoutCard } from '../components/WorkoutCard'
import { CollectionPage } from '../../../components/CollectionPage/CollectionPage'

export function WorkoutCollectionPage() {
    return (
        <CollectionPage
        hook={useWorkoutsList}
        CardComponent={WorkoutCard}
        titlePersonal="Your Workouts"
        titleAll="All Workouts"
        emptyText="No workouts found."
        dataKey="workouts"
    />
    )
}