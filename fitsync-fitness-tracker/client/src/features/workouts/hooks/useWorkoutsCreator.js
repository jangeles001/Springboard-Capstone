import { useContext } from 'react'
import { WorkoutsCreatorContext } from '../components/workoutsCreator/WorkoutsCreatorContext'

export const useWorkoutsCreatorContext = () => useContext(WorkoutsCreatorContext);