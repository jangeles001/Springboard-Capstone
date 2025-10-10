export default function Workout({ exercise }){
    return (
        <div
        className="flex flex-col bg-gray-100 rounded-xl p-3 border border-gray-300"
        >
            <h3 className="text-md font-medium text-gray-800">
                {exercise.translations?.[0]?.name || `Exercise# ${exercise.id}`}
            </h3>
            <p className="text-sm text-gray-600">
                {exercise.translations?.[0]?.description.replace(/<[^>]*>/g, "") || "No description provided"}
            </p>
        </div>
    )
}