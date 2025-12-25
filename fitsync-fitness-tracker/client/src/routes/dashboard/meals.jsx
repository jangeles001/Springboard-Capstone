import { createFileRoute } from '@tanstack/react-router';
import { MealsListDisplay } from '../../features/meals/components/MealsListDisplay';

export const Route = createFileRoute('/dashboard/meals')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='flex flex-col justify-center'>
      <MealsListDisplay />
    </div>
  )
}
