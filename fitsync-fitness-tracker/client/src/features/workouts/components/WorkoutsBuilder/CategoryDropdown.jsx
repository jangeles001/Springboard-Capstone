import { useEffect } from 'react'
import { useCategories, useCategoriesError, useCategoryActions, useCategoriesStatus } from '../../store/CategoryStore'

export default function CategoryDropdown({ onChange, isLoading, style}) {
    // Store state slices
    const categories = useCategories();
    const state = useCategoriesStatus();
    const error = useCategoriesError();

    // Store actions slice
    const { fetchCategories } = useCategoryActions();
    
    // Fetches categories on mount
    useEffect(() => {
        fetchCategories();
    })

    // Searches for selected category
    const setAndFetch = (id) => {
       onChange(id);
    }

    return (
        <div 
        className={style}
        data-testid='category-dropdown'
        >
            <label htmlFor='categories' className='p-2'>Category Filter:</label>
            <select
            id='categories'
            name='categories'
            disabled={state !== "success" || isLoading === true || error}
            onChange={(e) => {
                setAndFetch(e.target.value);
            }}
            type='text'
            className='ml-auto border-1 rounded w-30 p-1'
            >
                <option value="">
                    All
                </option>
                {!error && categories?.map((category) => (
                     <option key={category.id} value={category.id}>{category.name}</option>
                ))}
            </select>
        </div>
    )
}