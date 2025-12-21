import { MealDisplayContext } from './MealDisplayContext'
import { useMealDisplay } from '../../hooks/useMealDisplay';

export function MealsFormComposer({ children }){
    const context = useMealDisplay();
    return (
        <MealDisplayContext.Provider value={context}>
            <div className='flex flex-col bg-white m-20 border-2 rounded-xl p-10 gap-3 min-h-min min-w-[800px]'
            >
                {children}
            </div>
        </MealDisplayContext.Provider>
    );
}