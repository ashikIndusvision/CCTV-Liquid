import React from "react";
import { useTheme } from "../../../Context/ThemeContext";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="p-2 border rounded-md bg-background text-text border-gray-500"
      onClick={toggleTheme}
    >
      {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
};

export default ThemeToggle;
