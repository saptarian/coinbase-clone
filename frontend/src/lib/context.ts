import React from 'react'
import { UserDataRequired } from '@/types'


export interface DashboardContextType extends UserDataRequired {
  from: string
  pathname: string
  slug?: string
}

export const DashboardContext = 
  React.createContext<DashboardContextType | null>(null)

export function useDashboard() {
  const context =  React.useContext(DashboardContext)
  if (!context) 
    throw new Error('useDashboard must be used within provider')
  
  return context
}
