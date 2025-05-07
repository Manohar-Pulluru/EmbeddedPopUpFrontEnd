import React, { createContext, useContext } from "react";
import { useAppStates } from "./appState";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const appStates = useAppStates();

  return (
    <AppContext.Provider value={appStates}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
