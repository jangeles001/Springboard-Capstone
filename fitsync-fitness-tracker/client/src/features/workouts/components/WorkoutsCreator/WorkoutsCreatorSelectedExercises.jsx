import { useWorkoutsCreatorContext } from '../../hooks/useWorkoutsCreator'
import { PortalTooltip } from '../../../../components/PortalTooltip'

const GRID =
  "grid grid-cols-1 md:grid-cols-8 gap-x-4 gap-y-3";

export function WorkoutsCreatorSelectedExercises() {
  const { 
    createdWorkout,
    UNIT_OPTIONS,
    handleExerciseInformationChange,
    handleRemove,
  } = useWorkoutsCreatorContext();

  return (
    <div className="flex flex-col gap-4">

      {/* Header row – desktop only */}
      <div className={`${GRID} hidden md:grid font-semibold text-sm`}>
        <div className="md:col-span-3 pl-2">Exercise</div>
        <div className="md:col-span-1 text-center">Reps</div>
        <div className="md:col-span-2">Measure Type</div>
        <div className="md:col-span-2">Weight / Duration</div>
      </div>

      {/* Empty state */}
      {!createdWorkout?.length && (
        <p className="text-center text-gray-500 py-12">
          Click on an exercise to add it to this window
        </p>
      )}

      {/* Rows */}
      {createdWorkout?.map((exercise) => {
        const isBodyWeight = exercise.equipment.some(
          (equipment) => equipment.id === 7
        )

        return (
          <div key={exercise.id} className={GRID}>

            {/* Exercise */}
            <div className="md:col-span-3">
              <span className="md:hidden text-xs font-semibold text-gray-500">
                Exercise
              </span>

              <PortalTooltip
                text={exercise.translations?.[0]?.description || "No description"}
              >
                <button
                  type="button"
                  onClick={() => handleRemove(exercise.id)}
                  className="
                    w-full
                    mt-1
                    rounded-xl
                    border
                    shadow-sm
                    p-3
                    text-left
                    hover:bg-gray-50
                  "
                >
                  <h3 className="font-bold">
                    {exercise.translations?.[0]?.name?.toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {exercise.category?.name}
                  </p>
                </button>
              </PortalTooltip>
            </div>

            {/* Reps */}
            <div className="md:col-span-1">
              <span className="md:hidden text-xs font-semibold text-gray-500">
                Reps
              </span>
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded-md"
                maxLength={10}
                placeholder="0"
                onChange={(e) =>
                  handleExerciseInformationChange(e, exercise.id, "reps")
                }
              />
            </div>

            {!isBodyWeight && (
              <>
                {/* Measurement Type */}
                <div className="md:col-span-2">
                  <span className="md:hidden text-xs font-semibold text-gray-500">
                    Measure Type
                  </span>
                  <select
                    className="w-full mt-1 p-2 border rounded-md text-sm"
                    value={exercise.measurementType || ""}
                    onChange={(e) =>
                      handleExerciseInformationChange(
                        e,
                        exercise.id,
                        "measurementType"
                      )
                    }
                  >
                    <option value="" disabled>
                      Select…
                    </option>
                    <option value="Weight">Weight</option>
                    <option value="Duration">Duration</option>
                  </select>
                </div>

                {/* Measurement */}
                <div className="md:col-span-2 grid grid-cols-2 gap-2">
                  <div>
                    <span className="md:hidden text-xs font-semibold text-gray-500">
                      Value
                    </span>
                    <input
                      type="text"
                      className="w-full mt-1 p-2 border rounded-md"
                      maxLength={3}
                      placeholder="0"
                      onChange={(e) =>
                        handleExerciseInformationChange(
                          e,
                          exercise.id,
                          "measurement"
                        )
                      }
                    />
                  </div>

                  <div>
                    <span className="md:hidden text-xs font-semibold text-gray-500">
                      Unit
                    </span>
                    <select
                      className="w-full mt-1 p-2 border rounded-md text-sm"
                      value={exercise.unit || ""}
                      disabled={!exercise.measurementType}
                      onChange={(e) =>
                        handleExerciseInformationChange(
                          e,
                          exercise.id,
                          "unit"
                        )
                      }
                    >
                      <option value="">Unit</option>
                      {UNIT_OPTIONS[exercise.measurementType]?.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}