import { WorkoutsCreatorComposer as WorkoutsCreator} from './WorkoutsCreatorComposer';
import { WorkoutsCreatorHeader } from './WorkoutsCreatorHeader';
import { WorkoutsCreatorSelectedExercises } from './WorkoutsCreatorSelectedExercises';
import { WorkoutsCreatorSubmitButton } from './WorkoutsCreatorSubmitButton';

// Attaching subcomponents to the main form component
WorkoutsCreator.header = WorkoutsCreatorHeader;
WorkoutsCreator.Selected = WorkoutsCreatorSelectedExercises;
WorkoutsCreator.SubmitButton = WorkoutsCreatorSubmitButton;

export { WorkoutsCreator }