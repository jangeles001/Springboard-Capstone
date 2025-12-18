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
                <span className='flex justify-center'>
                    <button type='submit' 
                    className="mt-auto px-2 py-2 bg-gradient-to-r from-blue-500 to-indigo-600
                    text-white text-sm rounded-lg shadow min-w-[200px] hover:opacity-90 transition"
                    >
                        Create Meal
                    </button>
                </span>
            </form>
        </MealsFormContext.Provider>
    );
}