import { useWorkoutsCreatorContext } from '../../hooks/useWorkoutsCreator'

export function WorkoutsCreatorSubmitButton() {
    const { handleSubmit } = useWorkoutsCreatorContext();
    return (
         <button 
          className="mt-auto mb-4 px-4 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm rounded-lg shadow hover:opacity-90 transition"
          onClick={handleSubmit}>
            Create Workout
          </button>
    )
}