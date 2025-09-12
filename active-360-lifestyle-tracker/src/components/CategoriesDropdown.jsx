import { useEffect } from 'react'
import { useCategoryStore } from '../store/CategoryStore'

export default function CategoryDropdown({ onChange, style}) {
    
    const { categories, fetchCategories, error } = useCategoryStore();
    
    useEffect(() => {
        fetchCategories();
    },[fetchCategories])

    const setAndFetch = (id) => {
       const url =  id ? `https://wger.de/api/v2/exerciseinfo/?category=${id}&language=2` : "https://wger.de/api/v2/exerciseinfo/?limit=20&offset=0";
       onChange(url);
    }

    return (
        <div className={style}>
            <select
            onChange={(e) => setAndFetch(e.target.value)}
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