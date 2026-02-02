import { createFileRoute } from '@tanstack/react-router'
import { CollectionPage } from "../../components/CollectionPage/CollectionPage";
import { useMealsList } from '../../features/meals/hooks/useMealsList';
import { MealCard } from '../../features/meals/components/MealCard';  

export const Route = createFileRoute('/dashboard/meals/')({
  component: () =>         
    <CollectionPage
    hook={useMealsList}
    CardComponent={MealCard}
    titlePersonal="Your Meals"
    titleAll="All Meals"
    emptyText="No meals found."
    dataKey="meals"
    />,
})
