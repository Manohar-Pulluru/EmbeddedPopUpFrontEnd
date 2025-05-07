import { useState } from "react";

export const useAppStates = () => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);
  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return {
    user,
    login,
    logout,
    theme,
    toggleTheme,
  };
};
