export function DisplayPageHeader({ data }) {
  return (
    <div className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">
      <h1 className="text-4xl font-bold text-gray-800">{data?.data.mealName || "Untitled"}</h1>
      <p className="mt-2 text-gray-600">{data?.data?.description || "No description available."}</p>
    </div>
  );
}