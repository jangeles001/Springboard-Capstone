import { createFileRoute } from '@tanstack/react-router'
import { MealCollectionPage } from '../../features/meals/pages/MealCollectionPage';

export const Route = createFileRoute('/dashboard/meals/')({
  component: MealCollectionPage,
})
