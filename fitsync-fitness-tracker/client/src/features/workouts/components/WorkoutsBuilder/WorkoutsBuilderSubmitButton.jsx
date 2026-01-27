export function WorkoutsBuilderSubmitButton() {
  return (
    <div className="relative bottom-0 bg-white pt-4 border-t">
      <button
        type="submit"
        className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-medium text-white shadow hover:opacity-90 transition"
      >
        Create Workout
      </button>
    </div>
  );
}