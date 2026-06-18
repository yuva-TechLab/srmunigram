import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Pages.css"; 
import srmLogo from "../assets/masterlogo.png";

const Login = () => {
  const navigate = useNavigate();
  const [emailPrefix, setEmailPrefix] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const SRM_DOMAIN = "@srmist.edu.in";

  // Use this for localhost testing; replace with Render URL when deployed
  const API_BASE = "https://srm-unigram-backend.onrender.com/api/auth";

  const handleLogin = async () => {
    const email = emailPrefix + SRM_DOMAIN;

    if (!emailPrefix) {
      setStatusMessage("Please enter your SRM ID");
      return;
    }
    if (!password) {
      setStatusMessage("Please enter your password");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok && result.token) {
        localStorage.setItem("token", result.token);
        if (result.name) localStorage.setItem("name", result.name);
        if (result.userId) localStorage.setItem("userId", result.userId); // ✅ new line

        setStatusMessage("Login successful");
        // wait 3 seconds so user sees the message
        setTimeout(() => navigate("/feed"), 1000);
      } else {
        setStatusMessage(result.message || result.error || "Login failed");
      }
    } catch (err) {
      setStatusMessage("Network error. Try again.");
    }
  };

  return (
    <div className="login-page">
      {/* Master Logo */}
      <div className="intro-logo">
        <img src={srmLogo} alt="SRM Logo" className="masterlogo" />
      </div>

      {/* SRM ID Input Row */}
      <div className="input-row">
        <input
          className="input-field1"
          type="text"
          placeholder="Enter your SRM ID"
          value={emailPrefix}
          onChange={(e) => setEmailPrefix(e.target.value)}
        />
        <span className="domain-suffix">{SRM_DOMAIN}</span>
      </div>

      {/* Password Input */}
      <input
        className="input-field2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Login Button */}
      <button className="submit-btn" onClick={handleLogin}>
        Log In
      </button>

      {/* Status Message */}
      {statusMessage && (
        <div
          className="response-message"
          style={{
            color: statusMessage === "Login successful" ? "#034ea2" : "red"
          }}
        >
          {statusMessage}
        </div>
      )}

<div className="note">Do not include "@srmist.edu.in" in the email field</div>
      {/* Links */}
      <Link to="/forgot" className="forgotpassword-link">
        Forgot password?
      </Link>
      <div className="or-text">OR</div>
      <Link to="/signup" className="signup-link">
        Sign up
      </Link>
    </div>
  );
};

export default Login;