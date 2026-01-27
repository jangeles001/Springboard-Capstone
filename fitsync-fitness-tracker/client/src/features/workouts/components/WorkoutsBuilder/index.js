import { WorkoutsBuilderComposer as WorkoutsBuilder} from './WorkoutsBuilderComposer';
import { WorkoutsBuilderHeader } from './WorkoutsBuilderHeader';
import { WorkoutsBuilderSelectedExercises } from './WorkoutsBuilderSelectedExercises';
import { WorkoutsBuilderSubmitButton } from './WorkoutsBuilderSubmitButton';

// Attaches subcomponents to the main form component
WorkoutsBuilder.Header = WorkoutsBuilderHeader;
WorkoutsBuilder.Selected = WorkoutsBuilderSelectedExercises;
WorkoutsBuilder.SubmitButton = WorkoutsBuilderSubmitButton;

export { WorkoutsBuilder }