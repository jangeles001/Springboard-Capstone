import { createFileRoute } from '@tanstack/react-router'
import Loading from '../../components/Loading';
import CategoryDropdown from '../../components/CategoriesDropdown';
import { useExercises } from '../../hooks/useExercises';

export const Route = createFileRoute('/dashboard/exercises')({
  component: RouteComponent,
})

function RouteComponent() {

  const { response, nextLink, prevLink, isLoading, error, loadData, loadByCategory } = useExercises();

  if(error) return <p>error</p>;

  return (
    <>
      <div className='flex flex-col items-center bg-gradient-to-r from-blue-500 to-indigo-600'>
        <div className='flex flex-col rounded-2xl border border-gray-200 shadow-md bg-gray-100 w-[1100px] pt-5 mt-20 mb-20'>
          <div className='flex flex-row'>
            <h1 className='font-inter text-5xl p-3 font-header ml-5'>Exercises</h1>
            <CategoryDropdown onChange={loadByCategory} isLoading={isLoading} style='ml-auto'/>
          </div>

          <div className='flex flex-col items-center gap-10 pt-4'>
            {isLoading ? <Loading type='content-only' /> : response?.map((exercise) => {
              return (
                <div key={exercise.id} className='flex flex-col items-center w-[900px] rounded-2xl border border-gray-500 p-5 shadow-md gap-1'>
                  <h1 className='font-bold'>{exercise.translations[0].name.toUpperCase()}</h1>
                  <img src={exercise.muscles[0]?.image_url_main}></img>
                  <h2>Exercise Category: {exercise.category.name}</h2>
                  <p key={exercise.translations[0].name} className=''>{exercise.translations[0].description ? exercise.translations[0].description.replace(/<[^>]*>/g, "") : "No Description Provided"}</p>
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
    </> 
  ) 
}
