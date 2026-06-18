import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Pages.css";
import srmLogo from "../assets/masterlogo.png";

const API_URL = "https://srm-unigram-backend.onrender.com/api"; // change when backend deployed

export default function ForgotPassword() {
  const navigate = useNavigate();

  const SRM_DOMAIN = "@srmist.edu.in";

  // Step 1: Request OTP
  const [emailPrefix, setEmailPrefix] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Step 2: Reset password
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const email = emailPrefix + SRM_DOMAIN;

  const requestOTP = async () => {
    if (!emailPrefix) return setStatusMessage("Please enter your SRM ID");

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (response.ok) {
        setStatusMessage("OTP sent to your email. Check inbox!");
        setOtpRequested(true);
      } else {
        setStatusMessage(result.error || "Failed to send OTP");
      }
    } catch (err) {
      setStatusMessage("Network error. Try again.");
    }
  };

  const resetPassword = async () => {
    if (!otp || !newPassword) return setStatusMessage("Please enter OTP and new password");

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const result = await response.json();
      if (response.ok) {
        setStatusMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setStatusMessage(result.error || "Failed to reset password");
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

      {!otpRequested ? (
        <>
          <div className="instruction-text">Enter your SRM ID to reset password</div>
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
          <button className="submit-btn" onClick={requestOTP}>
            Request OTP
          </button>
        </>
      ) : (
        <>
          <div className="instruction-text">Check your spam or junk folder for OTP</div>
          <input
            className="input-field2"
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <input
            className="input-field2"
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button className="submit-btn" onClick={resetPassword}>
            Reset Password
          </button>
        </>
      )}

      {statusMessage && (
        <div
          className="response-message"
          style={{
            color:
              statusMessage === "OTP sent to your email. Check inbox!" ||
              statusMessage.toLowerCase().includes("successful")
                ? "#034ea2"
                : "red",
          }}
        >
          {statusMessage}
        </div>
      )}
    </div>
  );
}