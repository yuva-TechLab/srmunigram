import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Pages.css";
import srmLogo from "../assets/masterlogo.png";

const API_URL = "https://srm-unigram-backend.onrender.com/api"; // change to your backend URL when deployed

const Signup = () => {
  const navigate = useNavigate();

  const SRM_DOMAIN = "@srmist.edu.in";

  const [fullName, setFullName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [emailPrefix, setEmailPrefix] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSignup = async () => {
    const email = emailPrefix + SRM_DOMAIN;

    if (!fullName) return setStatusMessage("Please enter your full name");
    if (!regNumber) return setStatusMessage("Please enter your register number");
    if (!emailPrefix) return setStatusMessage("Please enter your SRM ID");
    if (!password) return setStatusMessage("Please enter your password");

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, email, password, regNumber }),
      });

      const result = await response.json();

      if (response.ok) {
        // Store email in localStorage for VerifyOTP.js
        localStorage.setItem("signupEmail", email);

        setStatusMessage("Signup successful!");
        // Wait 1 second so user can see the message
        setTimeout(() => navigate("/verify-otp"), 1000);
      } else {
        setStatusMessage(result.message || result.error || "Signup failed");
      }
    } catch (err) {
      setStatusMessage("Network error. Try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="intro-logo">
        <img src={srmLogo} alt="SRM Logo" className="masterlogo" />
      </div>

      <input
        className="input-field3"
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <input
        className="input-field4"
        type="text"
        placeholder="Register Number"
        value={regNumber}
        onChange={(e) => setRegNumber(e.target.value.toUpperCase())} // Uppercase
      />

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

      <input
        className="input-field2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="submit-btn" onClick={handleSignup}>
        Sign Up
      </button>

      {statusMessage && (
        <div
          className="response-message"
          style={{
            color: statusMessage === "Signup successful!" ? "#034ea2" : "red"
          }}
        >
          {statusMessage}
        </div>
      )}
<div className="note">Do not include "@srmist.edu.in" in the email field</div>
      <div className="or-text">OR</div>
      <Link to="/login" className="signup-link">
        Already have an account? Log in
      </Link>
    </div>
  );
};

export default Signup;