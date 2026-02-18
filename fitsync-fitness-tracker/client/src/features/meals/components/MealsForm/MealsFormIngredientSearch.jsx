import { useMealsFormContext } from '../../hooks/useMealsFormContext'
import ResultItem from '../ResultItem';
import useSearch from '../../hooks/useSearch'

export function MealsFormIngredientSearch({ isOpen, setIsOpen }) {
    const { handleClick } = useMealsFormContext();
    const { 
            inputValue,
            handleScroll,
            setInputValue, 
            results, 
        } = useSearch("" ,600);
    return (
        <div className="flex flex-col">
            <label htmlFor="ingredients" className="form-label">Enter Ingredient</label>
            <div className="relative w-full max-w-md">
                <input
                type='text'
                className="border rounded min-w-md pl-3"
                name='ingredients'
                id="ingredients"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
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
                            setInputValue("");
                            setIsOpen(false);
                        }}
                        data-testid={`search-result-${item.fdcId}`} 
                        />
                    ))}
                    </ul>
                )}
            </div>
        </div>
    );
}