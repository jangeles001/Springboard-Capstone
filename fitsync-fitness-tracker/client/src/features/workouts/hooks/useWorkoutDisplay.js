import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePublicId } from "../../../store/UserStore";
import { fetchWorkoutById } from "../services/fetchWorkoutById";

export function useWorkoutDisplay(workoutId) {
  const publicId = usePublicId();
  const query = useQuery({
    queryKey: ["workout", workoutId],
    queryFn: () => fetchWorkoutById(workoutId),
    retry: false,
  });

  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    if (query.isSuccess) {
      if (query.data.data.creatorPublicId === publicId) setIsCreator(true);
    } else {
      return;
    }
  }, [query, publicId]);
  //TODO: useCreator state to conditionally render workout edit form and buttons to edit fields

  return {
    ...query,
    isCreator,
  };
}
