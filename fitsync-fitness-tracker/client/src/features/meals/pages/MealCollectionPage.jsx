import { CollectionPage } from "../../../components/CollectionPage/CollectionPage";
import { useMealsList } from "../hooks/useMealsList";
import { MealCard } from "../components/MealCard";

export function MealCollectionPage() {
    return (
        <CollectionPage
        hook={useMealsList}
        CardComponent={MealCard}
        titlePersonal="Your Meals"
        titleAll="All Meals"
        emptyText="No meals found."
        dataKey="meals"
        />
    );        
}