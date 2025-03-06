import React from "react";
import "./LoginForm.css"; // Import styles
import logo from "../assets/logo.png"; // Import the image

const LoginForm = ({ theme }) => {
  return (
    <div className={`login-container ${theme}`}>
      <div className="login-box">
      <img src={logo} alt="Driftmood Coffee" className="logo" />
          <h2>Driftmood Coffee</h2>
        <input type="email" placeholder="Email address" className="input-field" />
        <input type="password" placeholder="Password" className="input-field" />
        <button className="login-button">Sign in</button>
        <button className="login-button">Sign up</button>
      </div>
    </div>
  );
};

export default LoginForm;
