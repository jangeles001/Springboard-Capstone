import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import Loading from '../../components/Loading';
import CategoryDropdown from '../../components/CategoriesDropdown';

export const Route = createFileRoute('/dashboard/exercises')({
  component: RouteComponent,
})

function RouteComponent() {

  const URL = "https://wger.de/api/v2/exerciseinfo/?limit=20&offset=0";

  const [ response, setResponse ] = useState([]);
  const [ prev, setPrev ] = useState(null);
  const [ next, setNext ] = useState(null);
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    fetchData(URL);
  },[])

  const fetchData = async (URL) => {
      setIsLoading(true);
      try {
        const res = await fetch(URL);
        const json = await res.json();

        const filtered = json.results.map((exercise) => {
          const englishTranslation = exercise.translations = exercise.translations.filter((description) => {
              return description.language === 2;
            }) 

            return {...exercise, translations: englishTranslation}; 
        })
        setResponse(filtered);
        setNext(json.next);
        setPrev(json.previous);
      } catch (err) {
        console.error("Error fetching workouts:", err);
      }finally{
        setIsLoading(false);
      }
    }

    const handleNext = () =>{
      if(next) fetchData(next);
    }

    const handlePrev = () => {
      if(prev) fetchData(prev);
    }

  if(isLoading) return (
    <>
      <div className='flex flex-col'>
        <div className='flex flex-row'>
          <h1 className='font-inter text-5xl p-3 font-header ml-10'>Exercises</h1>
          <CategoryDropdown onChange={(url) => fetchData(url)} style='ml-auto mr-14'/>
        </div>
        <Loading type='full-page' />
      </div>
    </>
  )

  return (
    <div className='flex flex-col'>
      <div className='flex flex-row'>
        <h1 className='font-inter text-5xl p-3 font-header ml-10'>Exercises</h1>
        <CategoryDropdown onChange={(url) => fetchData(url)} style='ml-auto mr-14'/>
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
          {prev ? <button onClick={handlePrev} className='hover:underline'>Prev</button> : ""}
          {next ? <button onClick={handleNext} className='hover:underline'>Next</button> : ""}
        </div> 
      </div> 
    </div>  
  ) 
}
