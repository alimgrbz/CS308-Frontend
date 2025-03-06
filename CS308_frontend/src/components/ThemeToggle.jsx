import React from "react";
import "./ThemeToggle.css"; // You can add styles if needed

const ThemeToggle = ({ toggleTheme }) => {
  return (
    <div className="theme-toggle">
      <button onClick={toggleTheme}>Switch Theme</button>
    </div>
  );
};

export default ThemeToggle;
