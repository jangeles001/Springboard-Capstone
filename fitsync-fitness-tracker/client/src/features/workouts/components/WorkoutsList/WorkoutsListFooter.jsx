import { useWorkoutsListContext } from "../../hooks/useWorkoutsListContext"

export function WorkoutsListFooter(){
    const { data, isFetching, handlePreviousPage, handleNextPage} = useWorkoutsListContext();
    return (
        <div className="flex flex-row gap-10 justify-center pt-10">
            <button 
            className="hover:underline disabled:hover:no-underline disabled:invisible"
            disabled={isFetching || !data?.data?.hasPreviousPage}
            onClick={() => handlePreviousPage()}
            >
                Prev
            </button> 
            <button 
            className="hover:underline  disabled:hover:no-underline disabled:invisible "
            disabled={isFetching || !data?.data?.hasNextPage}
            onClick={() => handleNextPage()}
            >
                Next
            </button>
        </div>
    )
}