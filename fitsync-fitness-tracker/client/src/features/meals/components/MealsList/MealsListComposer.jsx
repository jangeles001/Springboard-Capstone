import { MealsListContext } from './MealsListContext';
import { useMealsList } from '../../hooks/useMealsList';

export function MealsListComposer({ children }){
    const context = useMealsList({ limit: 10 });
    return (
        <div className="flex flex-col w-full">
            <MealsListContext.Provider value={context}>
                {children}
            </MealsListContext.Provider>
        </div>
    )
}