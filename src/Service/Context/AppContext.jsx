import React, { createContext, useContext } from 'react'
import { useAppStates } from './appState'

export const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const appStates = useAppStates()

  return (
    <AppContext.Provider value={appStates}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
