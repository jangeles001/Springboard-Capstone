import { MealsFormContext } from './MealsFormContext'
import { useMealsForm } from '../../hooks/useMealsForm';
import { Notification } from '../../../../components/Notification';

export function MealsFormComposer({ children }){
    const form = useMealsForm();
    return (
        <MealsFormContext.Provider value={form}>
            { form.message && <Notification visible={true} message={form.message} />}
            <form className='flex flex-col bg-white m-20 border-2 rounded-xl p-10 gap-3 min-h-min min-w-[800px]' 
            onSubmit={form.handleSubmit}
            >
                {children}
            </form>
        </MealsFormContext.Provider>
    );
}