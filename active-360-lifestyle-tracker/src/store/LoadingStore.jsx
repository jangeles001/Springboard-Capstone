import { create } from 'zustand'

export const LoadingStore = create((set, get) => ({
    isGlobalLoading: false,
    
}))