import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/workouts')({
  component: RouteComponent,
})

function RouteComponent() {

  const URL = "https://wger.de/api/v2/exerciseinfo/?limit=20";

  const [ response, setResponse ] = useState([]);
  const [ prev, setPrev ] = useState(null)
  const [ next, setNext ] = useState(null)

  useEffect(() => {
    //TODO loading page
    fetchData(URL);
    
  },[])

  const fetchData = async (URL) => {
      try {
        const res = await fetch(URL) 
        const json = await res.json()
        
        
        const filtered = json.results.map((exercise) => {
          
          const englishTranslation = exercise.translations = exercise.translations.filter((description) => {
              return description.language === 2;
            }) 

            return {...exercise, translations: englishTranslation} 
        })

        setResponse(filtered);
        setNext(json.next);
        setPrev(json.previous);

      } catch (err) {
        console.error("Error fetching workouts:", err)
      }
    }

    const handleNext = () =>{
      if(next) fetchData(next);
    }

    const handlePrev = () => {
      if(prev) fetchData(prev);
    }

  return (
    <div className='flex flex-col items-center gap-10 pt-4'> {/* On click go to exercise details page */}
      {console.log(response)}
      {response?.map((exercise) => {
        const translation = exercise.translations[0];
        return (
          <div key={exercise.id} className='flex flex-col items-center border-1 w-[900px] h-auto rounded-xl shadow p-2 gap-1'>
            <h1 className='font-bold'>{translation.name}</h1>
            <img src={exercise.muscles[0]?.image_url_main}></img>
            <h2>Exercise Category: {exercise.category.name}</h2>
            <p key={translation.name} className=''>{translation.description ? translation.description.replace(/<[^>]*>/g, "") : "No Description Provided"}</p>
          </div>
          )})}

          {/*TODO Pagination*/}
          <div className='flex flex-row pb-10 gap-4'>
             {prev ? <button onClick={handlePrev} className='hover:underline'>Prev</button> : ""}
             {next ? <button onClick={handleNext} className='hover:underline'>Next</button> : ""}
          </div>
      </div>
  )
}
