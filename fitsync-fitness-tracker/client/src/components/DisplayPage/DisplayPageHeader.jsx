export function DisplayPageHeader({ type, handleReturn, handleLog, resourceId, logIsPending }) {
  return (
    <div className="flex flex-col mb-15 min-w-min rounded-2xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800">{ `${type} Details`}</h1>
      <div className="mt-5 flex space-x-4 ml-auto ">
        <button 
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded hover:cursor-pointer"
        onClick={handleReturn}
        >
          Return to Collection
        </button>
        <button 
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded hover:cursor-pointer"
        onClick={() => handleLog(resourceId)}
        disabled={logIsPending}
        >
          Record {type}
        </button>
      </div>
    </div>
  );
}