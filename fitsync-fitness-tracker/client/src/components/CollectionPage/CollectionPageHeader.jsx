export function CollectionPageHeader({
  active,
  onChange,
  isLoading,
  titlePersonal,
  titleAll,
}) {
  return (
    <div className="flex flex-row mb-15 rounded-2xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-gray-900">
        {active === "Personal" ? titlePersonal : titleAll}
      </h1>
      <div className="flex justify-end gap-2 mt-5 mb-4 ml-auto">
        {["Personal", "All"].map((type) => (
          <button
            key={type}
            disabled={isLoading}
            onClick={() => onChange(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition hover:cursor-pointer
              ${
                active === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}