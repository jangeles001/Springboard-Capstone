import { useExercises } from "../hooks/useExercises";
import CategoryDropdown  from './CategoryDropdown'
import Loading from "./Loading";

export default function ExerciseList() {

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
      <div className='flex flex-col md:flex-[2] rounded-2xl border border-gray-200 shadow-md bg-gray-100 pt-5 px-5 md:mt-5 md:mb-5 max-w-screen min-w-[700px]'>
        <div className='flex flex-col md:flex-row items-center'>
        <h1 className='font-inter text-3xl md: text-5xl font-header'>Exercises</h1>
          <CategoryDropdown onChange={loadByCategory} isLoading={status} style='ml-auto'/>
        </div>
        <div className='flex flex-col items-center w-full gap-6 pt-4'>
          {status !== "success" ? <Loading type='content-only' /> : response?.map((exercise) => {
            return (
              <div key={exercise.id}
              onClick={() => handleClick(exercise)}
              className='flex flex-col items-center w-full rounded-2xl border border-gray-500 p-5 md:p- 8 shadow-md gap-1'
              >
                <h1 className='font-bold'>{exercise?.translations?.[0]?.name?.toUpperCase() || `Exercise #${exercise.id}`}</h1>
                <h2>Exercise Category: {exercise?.category?.name}</h2>
                <p>{exercise.translations?.[0]?.description.replace(/<[^>]*>/g, "") || "No Description Provided"}</p>
              </div> 
            )})
          }
          </div>
          <div className='flex flex-row justify-center gap-4 py-4'>
            {prevLink && <button onClick={() => loadData(prevLink)} className='hover:underline'>Prev</button>}
            {nextLink && <button onClick={() => loadData(nextLink)} className='hover:underline'>Next</button>}
          </div>
      </div>
    )
}