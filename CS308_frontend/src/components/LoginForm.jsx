import React from "react";
import "./LoginForm.css"; 
import logo from "../assets/logo.png"; 
import { Link } from "react-router-dom";

const LoginForm = ({ theme }) => {
  return (
    <div className={`login-container ${theme}`}>
      <div className="login-box">
      <img src={logo} alt="Driftmood Coffee" className="logo" />
          <h2>Driftmood Coffee</h2>
        <input type="email" placeholder="Email address" className="input-field" />
        <input type="password" placeholder="Password" className="input-field" />
        <button className="login-button">Log in</button>
        <p className="signup-link"> If you don't have an account? <a href="/signup">Sign up</a></p>

        
      </div>
    </div>
  );
};

export default LoginForm;
