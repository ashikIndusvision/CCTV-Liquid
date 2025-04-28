import React, { createContext, useState, useContext, useEffect , ReactNode } from "react";
import themes from "../Config/Theme";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  themeStyles: typeof themes.light; 
}

interface ThemeProviderProps {
    children: ReactNode;
  }
  

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);



export const ThemeProvider:React.FC<ThemeProviderProps> = ({children})=>{

    const storedTheme = (localStorage.getItem("theme") as Theme) || "light";
    const [theme, setTheme] = useState<Theme>(storedTheme);
 
    useEffect(() => {
        const root = document.documentElement;
        if (!root.classList.contains(theme)) {
          root.classList.remove("light", "dark");
          root.classList.add(theme);
          localStorage.setItem("theme", theme);
        }
      }, [theme]);


      const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
      };

      return (
        <ThemeContext.Provider value={{ theme, toggleTheme, themeStyles: themes[theme] }}>
          {children}
        </ThemeContext.Provider>
      );

}

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
      throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
  };