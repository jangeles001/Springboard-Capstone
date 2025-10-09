import { useWorkoutsCreatorContext } from '../../hooks/useWorkoutsCreator'

export function WorkoutsCreatorSelectedExercises() {
    const { createdWorkout, handleRemove } = useWorkoutsCreatorContext();
    return (
        <>
            {createdWorkout?.map((exercise) => {
            return( 
              <div key={exercise.id}
              onClick={() => handleRemove(exercise.id)}
              className='flex flex-col items-center rounded-2xl border border-gray-500 p-10 shadow-md w-[250px] gap-1'>
                <h1 className='font-bold'>{exercise?.translations?.[0]?.name?.toUpperCase() || `Exercise #${exercise.id}`}</h1>
                <h2>Category: {exercise?.category?.name}</h2>
              </div>
          )}) 
          || <p className='flex flex-col text-center text-gray-500 items-center w-[250px] p-10'>
              Click on a exercise to add it to this window
            </p>
          }
        </>
    )
    
}