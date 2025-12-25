import { useMealsListContext } from "../../hooks/useMealsListContext"

export function MealsListFooter(){
    const { data } = useMealsListContext();
    return (
        <div className="flex flex-row gap-10 justify-center pt-10">
        { data?.data?.prevPage  &&
            <button className="hover:underline">Prev</button> }
        { data?.data?.nextPage &&
            <button className="hover:underline">Next</button> }
        </div>
    )
}