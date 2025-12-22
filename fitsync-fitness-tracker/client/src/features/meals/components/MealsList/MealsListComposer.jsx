import { MealsListContext } from './MealsListContext';
import { useMealsList } from '../../hooks/useMealsList';

export function MealsListComposer({ children }){
    const context = useMealsList({ limit: 5 });
    return (
        <MealsListContext.Provider value={context}>
            {children}
        </MealsListContext.Provider>
    )
}