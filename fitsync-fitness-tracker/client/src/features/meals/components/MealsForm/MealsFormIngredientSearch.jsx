import { useMealsFormContext } from '../../hooks/useMealsFormContext'
import ResultItem from '../ResultItem';
import useSearch from '../../hooks/useSearch'

export function MealsFormIngredientSearch({ isOpen, setIsOpen }) {
    const { handleClick } = useMealsFormContext();
    const { 
            query,
            debouncedSetQuery,
            handleScroll, 
            results, 
        } = useSearch("" ,50); // Ingredients search bar debouncer 
    return (
        <div className="flex flex-col">
            <label htmlFor="ingredients" className="form-label">Enter Ingredient</label>
            <div className="relative w-full max-w-md">
                <input
                type='text'
                className="border rounded min-w-md pl-3"
                name='ingredients'
                id="ingredients"
                value={query}
                onChange={(e) => debouncedSetQuery(e.target.value)}
                placeholder='Type to search for ingredients...'
                onFocus={() => setIsOpen(true)}
                />
                {isOpen && (
                    <ul 
                    className="absolute left-0 right-0 mt-1 border rounded bg-white shadow-md z-10 max-h-60 overflow-y-auto"
                    onScroll={handleScroll}
                    >
                    {results?.map((item) => (
                        <ResultItem 
                        item={item}
                        key={item.fdcId} 
                        onClick={ () => {
                            handleClick(item)
                            debouncedSetQuery("");
                            setIsOpen(false);
                        }} 
                        />
                    ))}
                    </ul>
                )}
            </div>
        </div>
    );
}