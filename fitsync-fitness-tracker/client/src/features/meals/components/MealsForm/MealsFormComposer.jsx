import { MealsFormContext } from './MealsFormContext'
import { useMealsForm } from '../../hooks/useMealsForm';
import { Notification } from '../../../../components/Notification';

export function MealsFormComposer({ children }){
    const form = useMealsForm();
    return (
        <MealsFormContext.Provider value={form}>
            {form.message && (
                <Notification visible message={form.message} />
            )}

            <form
            onSubmit={form.handleSubmit}
            className="
            flex flex-col gap-6
            rounded-2xl border bg-white
            p-6 shadow-sm
            "
            >
                {children}
            </form>
        </MealsFormContext.Provider>
    );
}