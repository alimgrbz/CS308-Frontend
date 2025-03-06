import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
import ThemeToggle from "./components/ThemeToggle";
import "./App.css";

function App() {
  const [theme, setTheme] = useState("light"); // Default theme

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className={`app-container ${theme}`}>
      <ThemeToggle toggleTheme={toggleTheme} />
      <LoginForm theme={theme} />
    </div>
  );
}

export default App;
