import { useWorkoutsCreatorContext } from '../../hooks/useWorkoutsCreator'
import { PortalTooltip } from '../../../../components/PortalTooltip'

export function WorkoutsCreatorSelectedExercises() {
  const { 
    createdWorkout,
    UNIT_OPTIONS,
    handleExerciseInformationChange,
    handleRemove,
  } = useWorkoutsCreatorContext();
  return (
    <>
      <div className='grid grid-cols-3 md:grid-cols-5 gap-5'>
        {createdWorkout?.map((exercise) => {
          const isBodyWeight = exercise.equipment.some((equipment) => equipment.id === 7);

          return(
          <div key={exercise.id} className='flex flex-row items-center col-span-3 md:col-span-5 gap-3'>
            <PortalTooltip text={exercise.translations?.[0]?.description || "No description"}>
              <span 
              onClick={() => handleRemove(exercise.id)}
              className='flex flex-col col-span-1 md:col-span-3 items-center rounded-2xl border border-gray-500 shadow-md min-w-[180px] ml-2 p-3 gap-1'>
                  <h1 className='font-bold justify-center'>{exercise?.translations?.[0]?.name?.toUpperCase() || `Exercise #${exercise.id}`}</h1>
                  <h2>Category: {exercise?.category?.name}</h2>
              </span>
            </PortalTooltip>
            <input
            type='text' 
            className='col-span-1 pl-4 p-2 border border-gray-300 rounded-md w-24'
            maxLength={10}
            placeholder='0'
            onChange={(e) => handleExerciseInformationChange(e, exercise.id, "reps")}
            >
            </input>
            {!isBodyWeight && 
            <>
              <select 
              id="Measurement-Type"
              name="Measurement-Type"
              value={exercise.measurementType || ""}
              className='col-span-1 pl-4 p-2 pl-0 border border-gray-300 rounded-md w-full text-[12px]'
              onChange={(e) => handleExerciseInformationChange(e, exercise.id, "measurementType")}
              >
                <option value="" disabled>--Select an option--</option>
                <option value="Weight">Weight</option>
                <option value="Duration">Duration</option>
              </select>
              <input
              type='text' 
              className='col-span-1 pl-4 p-2 border border-gray-300 rounded-md w-full'
              maxLength={3}
              placeholder='0'
              onChange={(e) => handleExerciseInformationChange(e, exercise.id, "measurement")}
              >
              </input>
              <select 
              id="unit" 
              name="unit"
              value={exercise.unit || ""}
              className='col-span-1 mr-3 pl-4 p-2 border border-gray-300 rounded-md w-full text-[12px]'
              onChange={(e) => handleExerciseInformationChange(e, exercise.id, "unit")}
              disabled={!exercise.measurementType} // disable until a type is selected>
              >
               <option value="">--Select Unit--</option>
                {exercise.measurementType &&
                  UNIT_OPTIONS[exercise.measurementType]?.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                    )
                  )
                }
              </select>
            </>
            }
          </div>
          )}) 
          || <p className='col-span-5 text-center text-gray-500 items-center p-20'>
              Click on an exercise to add it to this window
          </p>
        }
      </div>
    </>
  )
}