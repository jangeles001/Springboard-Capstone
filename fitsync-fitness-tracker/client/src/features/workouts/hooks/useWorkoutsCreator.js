import { useContext } from 'react'
import { WorkoutsCreatorContext } from '../components/WorkoutsCreator/WorkoutsCreatorContext'

export const useWorkoutsCreatorContext = () => useContext(WorkoutsCreatorContext);