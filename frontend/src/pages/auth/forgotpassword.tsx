import React, { useState } from "react";
import "../css/Login.css";
import { useNavigate } from "react-router-dom";
import { backendPrefix } from "../../config";

type Step = "email" | "otp" | "reset";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [serverOtpToken, setServerOtpToken] = useState<string | null>(null);

  const maskEmail = (email: string): string => {
    const [local, domain] = email.split("@");
    if (!local || !domain) return email;
    const maskedLocal = local[0] + "*".repeat(Math.max(local.length - 1, 0));
    return `${maskedLocal}@${domain}`;
  };

  const handleSendOtp = async () => {
    setError(null);
    setSuccess(null);
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${backendPrefix}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Failed to send OTP");
      const data = await res.json();
      setServerOtpToken(data.token);

      setStep("otp");
      setSuccess(
        `A One-Time-Password (OTP) was sent to ${maskEmail(
          email
        )}. Enter those 6 digits here to verify your account and change your password.`
      );
    } catch {
      setError("Could not send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError(null);
    setSuccess(null);
    if (otp.length !== 6) {
      setError("Enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${backendPrefix}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, otpToken: serverOtpToken }),
      });

      if (!res.ok) throw new Error("Invalid OTP");
      setSuccess("✅ OTP verified successfully!");
      setTimeout(() => {
        setStep("reset");
        setSuccess(null);
      }, 1200);
    } catch {
      setError("Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError(null);
    setSuccess(null);
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${backendPrefix}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword, email }),
      });

      if (!res.ok) throw new Error("Failed to reset password");

      setSuccess("✅ Password reset successful! Redirecting...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch {
      setError("Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === "otp") setStep("email");
    if (step === "reset") setStep("otp");
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="auth__bg">
      <main className="auth__container">
        <section
          className="auth__card"
          role="dialog"
          aria-label="Forgot Password"
        >
          {/* Top back button */}
          {step !== "email" && (
            <div className="auth__top">
              <button
                onClick={handleBack}
                className="back-arrow"
                aria-label="Go back"
                title="Go back"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  width="22"
                  height="22"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </div>
          )}

          <header className="auth__header">
            <div className="logo">
              <span className="logo__dot" />
              <span className="logo__text">ViralMotion</span>
            </div>
            <h1 className="auth__title">Forgot Password</h1>
            <p className="auth__subtitle">
              {step === "email" && "Enter your email to receive an OTP."}
              {step === "otp" && "Enter the OTP sent to your email."}
              {step === "reset" && "Create your new password."}
            </p>
          </header>

          {error && <div className="auth__error">{error}</div>}
          {success && <div className="auth__success">{success}</div>}

          {step === "email" && (
            <div className="auth__form">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                style={{ marginBottom: "1.2rem" }}
              />
              <button
                className="btn btn--primary"
                onClick={handleSendOtp}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          )}

          {step === "otp" && (
            <div className="auth__form">
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="input"
              />
              <button
                className="btn btn--primary"
                onClick={handleVerifyOtp}
                disabled={loading}
                style={{
                  marginTop: "1.5rem",
                }}
              >
                {loading ? "Verifying..." : "Confirm OTP"}
              </button>
            </div>
          )}

          {step === "reset" && (
            <div className="auth__form">
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input"
              />
              <button
                className="btn btn--primary"
                onClick={handleResetPassword}
                disabled={loading}
                style={{
                  marginTop: "1.5rem",
                }}
              >
                {loading ? "Updating..." : "Set New Password"}
              </button>
            </div>
          )}

          <footer className="auth__footer" style={{ marginTop: "1.5rem" }}>
            <a className="link" href="/login">
              Back to login
            </a>
          </footer>
        </section>
      </main>
    </div>
  );
};

export default ForgotPasswordPage;
