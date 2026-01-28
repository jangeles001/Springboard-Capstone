import { MealDisplayCard } from "../../features/meals/components/MealDisplayCard.jsx";
import Loading from "../Loading.jsx";

export function DisplayPageBody({
  isLoading,
  isError,
  error,
  data,
  publicId
}) {
    if (isLoading) return <Loading type="content-only" />;
    if (isError) return (console.error(error) || <p>Error loading data.</p>);


    return (
        <MealDisplayCard data={data} publicId={publicId} />
    );
}