import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../services/api";
import { usePublicId } from "../../../store/UserStore";

export function useMealDisplay(mealId){
    const publicId = usePublicId;
    const query = useQuery({
        queryKey:["meal", mealId],
        queryFn: api.get(`api/v1/meals/${mealId}`)
    });

    const [isCreator, setIsCreator] = useState(false);

    useEffect(() => {
        if(query.isSuccess){
            if(query.data.data.creatorPublicId === publicId) 
                setIsCreator(true)
        }else{
            return;
        }
            
    },[query, publicId])
    //TODO: useCreator state to conditionally render workout edit form and buttons to edit fields

    return {
        ...query,
        isCreator,
    };
}