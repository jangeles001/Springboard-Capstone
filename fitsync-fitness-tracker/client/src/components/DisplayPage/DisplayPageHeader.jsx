export function DisplayPageHeader({ type }) {
  return (
    <div className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">
      <h1 className="text-4xl font-bold text-gray-800">{ `${type} Details`}</h1>
      <div className="mt-5 flex space-x-4">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Return to Collection</button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Add to Favorites</button>
      </div>
    </div>
  );
}