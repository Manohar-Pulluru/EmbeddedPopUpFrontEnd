import { useState } from "react";

export const useAppStates = () => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");
  const [showFlyerTemplate, setShowFlyerTemplate] = useState(false);
  const [flyerTemplateId, setFlyerTemplateId] = useState(null)

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);
  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const [isCartChanged, setIsCartChanged] = useState(false);

  const toggleCart = () => {
    setIsCartChanged(!isCartChanged);
  };

  return {
    user,
    login,
    logout,
    theme,
    toggleTheme,
    toggleCart,
    isCartChanged,
    showFlyerTemplate,
    setShowFlyerTemplate,
    flyerTemplateId,
    setFlyerTemplateId
  };
};
