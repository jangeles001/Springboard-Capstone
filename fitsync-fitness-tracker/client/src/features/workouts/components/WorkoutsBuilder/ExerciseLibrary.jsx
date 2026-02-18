import { useExercises } from "../../hooks/useExercises";
import CategoryDropdown  from './CategoryDropdown'
import Loading from "../../../../components/Loading";

export default function ExerciseLibrary() {

    const { 
        response,
        nextLink, 
        prevLink, 
        status,  
        loadData, 
        handleClick,
        loadByCategory
        } = useExercises();

    return (
      <div 
      className='flex flex-col flex-[2] rounded-2xl border shadow-sm bg-white p-5'
      data-testid='library-container'
      >
        <div className='flex flex-col md:flex-row items-center'>
          <h2 className="text-2xl font-semibold text-gray-900">
            Exercise Library
          </h2>
          <CategoryDropdown onChange={loadByCategory} isLoading={status} style='ml-auto'/>
        </div>
        <div 
        className='flex flex-col items-center w-full gap-6 pt-4 hover:cursor-pointer'
        data-testid='library'
        >
          {status !== "success" ? <Loading type='content-only' /> : response?.map((exercise) => {
            return (
              <div key={exercise.id}
              onClick={() => handleClick(exercise)}
              className='flex flex-col items-center w-full ml-2 rounded-2xl border border-black p-5 md:p-8 hover:shadow-md gap-2'
              >
                <h1 className='font-bold'>{exercise?.translations?.[0]?.name?.toUpperCase() || `Exercise #${exercise.id}`}</h1>
                <h2>Exercise Category: {exercise?.category?.name}</h2>
                <p>{exercise.translations?.[0]?.description?.replace(/<[^>]*>/g, "") || "No Description Provided"}</p>
              </div> 
            )})
          }
          </div>
          <div className='flex flex-row justify-center gap-4 py-4'>
            {prevLink &&
              <button
              onClick={
                () => loadData(prevLink)
              } 
              className='hover:underline'
              data-testid='prev-button'
              >
                Prev
              </button>
            }
            {nextLink &&
              <button 
              onClick={
                () => loadData(nextLink)
              } 
              className='hover:underline'
              data-testid='next-button'
              >
                Next
              </button>
            }
          </div>
      </div>
    )
}