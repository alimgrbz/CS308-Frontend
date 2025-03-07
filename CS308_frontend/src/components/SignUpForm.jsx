import React from "react";
import { Link } from "react-router-dom";
import "./LoginForm.css"; 
import logo from "../assets/logo.png"; 

const SignUp = ({ theme }) => {
  return (
    <div className={`login-container ${theme}`}>
      <div className="login-box">
      <img src={logo} alt="Driftmood Coffee" className="logo" />
        <h2>Sign Up</h2>
        <input type="text" placeholder="Full Name" className="input-field" />
        <input type="email" placeholder="Email address" className="input-field" />
        <input type="password" placeholder="Password" className="input-field" />
        <input type="password" placeholder="Confirm Password" className="input-field" />
        <button className="login-button">Sign Up</button>
        <p className="signup-link">
          Already have an account? <Link to="/">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
