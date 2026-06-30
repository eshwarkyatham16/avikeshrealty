import { createContext, useEffect, useState } from "react";

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("avikesh-theme");
    return stored === "light" || stored === "dark" ? stored : "dark";
  });

  useEffect(() => {
    const root = document.body;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("avikesh-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const isDark = theme === "dark";

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeContext;
