import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import SignUp from "./components/SignUpForm";
import ThemeToggle from "./components/ThemeToggle";
import "./App.css";

function App() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <Router>
      <div className={`app-container ${theme}`}>
        <ThemeToggle toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<LoginForm theme={theme} />} />
          <Route path="/signup" element={<SignUp theme={theme}/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
