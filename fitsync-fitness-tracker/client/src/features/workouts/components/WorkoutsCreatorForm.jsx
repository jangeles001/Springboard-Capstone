import { WorkoutsCreator } from './WorkoutsCreator/index'

export function WorkoutsCreatorForm(){
    return (
        <WorkoutsCreator>
            <WorkoutsCreator.Header />
            <WorkoutsCreator.Selected />
            <WorkoutsCreator.SubmitButton />
        </WorkoutsCreator>
    )
}