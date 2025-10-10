import { createFileRoute } from '@tanstack/react-router'
import { WorkoutsCreatorForm } from '../../features/workouts/components/WorkoutsCreatorForm'
import Loading from '../../components/Loading';
import CategoryDropdown from '../../components/CategoriesDropdown';
import { useExercises } from '../../hooks/useExercises';

export const Route = createFileRoute('/dashboard/exercises')({
  component: RouteComponent,
})

function RouteComponent() {

  const { 
    response,
    nextLink, 
    prevLink, 
    status, 
    error, 
    loadData, 
    loadByCategory,
    handleClick,
    } = useExercises();

  if(error) return <div className="p-4 text-red-600">Error: {error.message}</div>;;

  return (
      <div className='flex flex-col md:flex-row md:items-start bg-gradient-to-r from-blue-500 to-indigo-600 gap-10 min-w-sm'>
        <WorkoutsCreatorForm />

        <div className='flex flex-col md:flex-[2] rounded-2xl border border-gray-200 shadow-md bg-gray-100 pt-5 m-10 md:mt-20 md:mb-20 md:mr-20'>
          <div className='flex flex-col md:flex-row'>
            <h1 className='font-inter text-5xl p-3 font-header ml-5'>Exercises</h1>
            <CategoryDropdown onChange={loadByCategory} isLoading={status} style='ml-auto'/>
          </div>

          <div className='flex flex-col items-center min-w-full gap-10 pt-4 px-30'>
            {status !== "success" ? <Loading type='content-only' /> : response?.map((exercise) => {
              return (
                <div key={exercise.id}
                onClick={() => handleClick(exercise)}
                className='flex flex-col items-center w-full rounded-2xl border border-gray-500 p-10 shadow-md gap-1'>
                  <h1 className='font-bold'>{exercise?.translations?.[0]?.name?.toUpperCase() || `Exercise #${exercise.id}`}</h1>
                  <h2>Exercise Category: {exercise?.category?.name}</h2>
                  <p>{exercise.translations?.[0]?.description.replace(/<[^>]*>/g, "") || "No Description Provided"}</p>
                </div> 
              )})
            }

            <div className='flex flex-row pb-10 gap-4'>
              {prevLink && <button onClick={() => loadData(prevLink)} className='hover:underline'>Prev</button>}
              {nextLink && <button onClick={() => loadData(nextLink)} className='hover:underline'>Next</button>}
            </div>
          </div>
        </div> 
      </div>
  ) 
}
