import { useEffect } from 'react'
import { useCatergories, useError, useCategoryActions } from '../store/CategoryStore'

export default function CategoryDropdown({ onChange, isLoading, style}) {
    // Store state slices
    const categories = useCatergories();
    const error = useError();

    // Store actions slice
    const { fetchCategories, } = useCategoryActions();
    
    useEffect(() => {
        fetchCategories();
    })

    const setAndFetch = (id) => {
       onChange(id);
    }

    return (
        <div className={style}>
            <label htmlFor='search' className='p-2'>Category Filter:</label>
            <select
            disabled={isLoading}
            onChange={(e) => {
                setAndFetch(e.target.value);
            }}
            type='text'
            name='search'
            className='ml-auto mr-25 m-5 border-1 rounded w-30 p-1'
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