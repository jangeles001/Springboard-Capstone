import { createFileRoute } from '@tanstack/react-router'
import Loading from '../../components/Loading';
import CategoryDropdown from '../../components/CategoriesDropdown';
import { useExercises } from '../../hooks/useExercises';

export const Route = createFileRoute('/dashboard/exercises')({
  component: RouteComponent,
})

function RouteComponent() {

  const { response, next, prev, isLoading, error, loadData } = useExercises();

  if(isLoading) return (
    <>
      <div className='flex flex-col'>
        <div className='flex flex-row'>
          <h1 className='font-inter text-5xl p-3 font-header ml-10'>Exercises</h1>
          <CategoryDropdown onChange={(url) => loadData(url)} isLoading={isLoading} style='ml-auto mr-14'/>
        </div>
        <Loading type='full-page' />
      </div>
    </>
  )

 if(error){
    return <p className="text-red-500">{error}</p>;
 } 

  return (
    <div className='flex flex-col'>
      <div className='flex flex-row'>
        <h1 className='font-inter text-5xl p-3 font-header ml-10'>Exercises</h1>
        <CategoryDropdown onChange={(url) => loadData(url)} style='ml-auto mr-14'/>
      </div>
        <div className='flex flex-col items-center gap-10 pt-4'> {/* On click go to exercise details page */}
          {response?.map((exercise) => {
            return (
              <div key={exercise.id} className='flex flex-col items-center border-1 w-[900px] h-auto rounded-xl shadow p-2 gap-1'>
                <h1 className='font-bold'>{exercise.translations[0].name.toUpperCase()}</h1>
                <img src={exercise.muscles[0]?.image_url_main}></img>
                <h2>Exercise Category: {exercise.category.name}</h2>
                <p key={exercise.translations[0].name} className=''>{exercise.translations[0].description ? exercise.translations[0].description.replace(/<[^>]*>/g, "") : "No Description Provided"}</p>
              </div> 
            )})
          }

        <div className='flex flex-row pb-10 gap-4'>
          {prev && <button onClick={() => loadData(prev)} className='hover:underline'>Prev</button>}
          {next && <button onClick={() => loadData(next)} className='hover:underline'>Next</button>}
        </div> 
      </div> 
    </div>  
  ) 
}
