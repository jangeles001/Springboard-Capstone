export function MealsFormFooter(){

    return (
        <div className="relative bottom-0 border-t bg-white pt-4">
            <button
            type="submit"
            className="
            w-full rounded-xl
            bg-gradient-to-r from-blue-600 to-indigo-600
            py-3 text-sm font-medium text-white
            shadow hover:opacity-90 transition
            "
            >
                Create Meal
            </button>
        </div>
    );
}