import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Pages.css";
import srmLogo from "../assets/masterlogo.png";

const API_URL = "https://srm-unigram-backend.onrender.com/api"; // change to backend URL when deployed

export default function VerifyOTP() {
  const navigate = useNavigate();

  const [otp, setOTP] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  // Retrieve email from localStorage
  const email = localStorage.getItem("signupEmail") || "";

  const handleVerifyOTP = async () => {
    if (!otp) return setStatusMessage("Please enter the OTP");

    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const result = await response.json();

      if (response.ok) {
        // OTP verified, remove stored email
        localStorage.removeItem("signupEmail");

        // Redirect to login or feed
        navigate("/login"); // or "/feed" if you want auto-login
      } else {
        setStatusMessage(result.error || "OTP verification failed");
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

      <div className="instruction-text">
        Check your spam or junk folder for OTP
      </div>

      <input
        className="input-field2"
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOTP(e.target.value)}
      />

      <button className="submit-btn" onClick={handleVerifyOTP}>
        Verify OTP
      </button>

      {statusMessage && <div className="response-message">{statusMessage}</div>}
    </div>
  );
}