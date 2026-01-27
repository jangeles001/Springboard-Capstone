import { WorkoutsBuilder } from './WorkoutsBuilder/index'

export function WorkoutsBuilderForm(){
    return (
        <WorkoutsBuilder>
            <WorkoutsBuilder.Header />
            <WorkoutsBuilder.Selected />
            <WorkoutsBuilder.SubmitButton />
        </WorkoutsBuilder>
    )
}