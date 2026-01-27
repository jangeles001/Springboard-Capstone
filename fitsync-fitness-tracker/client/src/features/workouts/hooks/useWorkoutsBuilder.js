import { useContext } from 'react'
import { WorkoutsBuilderContext } from '../components/WorkoutsBuilder/WorkoutsBuilderContext'

export const useWorkoutsBuilderContext = () => useContext(WorkoutsBuilderContext);