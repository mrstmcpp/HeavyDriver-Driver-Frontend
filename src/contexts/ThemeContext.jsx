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

  // useEffect(() => {
  //   const root = document.documentElement;
  //   root.classList.toggle("dark", theme === "dark");

  //   // Dynamically change PrimeReact theme
  //   const link =
  //     document.getElementById("prime-theme") || document.createElement("link");
  //   link.id = "prime-theme";
  //   link.rel = "stylesheet";
  //   link.href =
  //     theme === "dark"
  //       ? "https://unpkg.com/primereact/resources/themes/viva-dark/theme.css"
  //       : "https://unpkg.com/primereact/resources/themes/viva-light/theme.css";
  //   document.head.appendChild(link);

  //   localStorage.setItem("theme", theme);
  // }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
