import { useWorkoutsCreatorContext } from '../../hooks/useWorkoutsCreator'

export function WorkoutsCreatorSelectedExercises() {
  const { createdWorkout, handleRemove } = useWorkoutsCreatorContext();
  return (
    <>
      <div className='grid grid-cols-3 md:grid-cols-5 gap-5'>
        {createdWorkout?.map((exercise) => {
          return( 
          <div key={exercise.id} className='flex flex-row items-center col-span-3 md:col-span-5 gap-3'>
            <span 
            onClick={() => handleRemove(exercise.id)}
            className='flex flex-col col-span-1 md:col-span-3 items-center rounded-2xl border border-gray-500 shadow-md min-w-[180px] ml-2 p-3 gap-1'>
                <h1 className='font-bold'>{exercise?.translations?.[0]?.name?.toUpperCase() || `Exercise #${exercise.id}`}</h1>
                <h2>Category: {exercise?.category?.name}</h2>
            </span>
            <input
            type='text' 
            className='col-span-1 ml-auto pl-4 p-2 border border-gray-300 rounded-md w-full'
            placeholder='0'
            >
            </input>
            <input
            type='text' 
            className='col-span-1 ml-auto pl-4 p-2 border border-gray-300 rounded-md w-full'
            placeholder='0'
            >
            </input>
          </div>
          )}) 
          || <p className='flex flex-col col-span-5 text-center text-gray-500 items-center w-[250px] p-10'>
              Click on a exercise to add it to this window
          </p>
        }
      </div>
    </>
  )
    
}