import { createFileRoute } from '@tanstack/react-router'
import { WorkoutsListDisplay } from "../../features/workouts/components/WorkoutsListDisplay"


export const Route = createFileRoute('/dashboard/workouts')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col items-center w-full bg-gradient-to-r from-blue-500 to-indigo-600 py-10 px-5">
      <WorkoutsListDisplay withRemoveButton={true} />
    </div>
  )
}
