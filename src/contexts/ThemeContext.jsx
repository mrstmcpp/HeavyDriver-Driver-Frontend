import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark" // default = dark
  );

  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === "dark") {
      root.setAttribute("class", "dark");
    } else {
      root.setAttribute("class", "");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);


  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
