import React, { useState } from "react";
import "../css/Login.css";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import PersonIcon from "@mui/icons-material/Person";
import { backendPrefix } from "../../config";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!username.trim()) {
      setError("Username is required.");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== verifyPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${backendPrefix}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name: username,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      setSuccess(
        "Signup successful! 🎉 Please check your email to verify your account."
      );
    } catch (err) {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth__bg">
      <main className="auth__container">
        <section className="auth__card" role="dialog" aria-label="Sign Up">
          <header className="auth__header">
            <div className="logo">
              <span className="logo__dot" />
              <span className="logo__text">ViralMotion</span>
            </div>
            <h1 className="auth__title">
              Create Account <span className="wave">🚀</span>
            </h1>
            <p className="auth__subtitle">
              Join to start creating snappy, TikTok-style animations.
            </p>
          </header>

          {error && (
            <div className="auth__error" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="auth__success" role="alert">
              {success}
            </div>
          )}

          {!success && (
            <form className="auth__form" onSubmit={onSubmit} noValidate>
              <div className="field">
                <PersonIcon className="field__icon" fontSize="small" />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input"
                  autoComplete="username"
                  aria-label="Username"
                  required
                />
              </div>

              <div className="field">
                <span className="field__icon" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 6h16v12H4z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <path
                      d="m4 7 8 6 8-6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  autoComplete="email"
                  aria-label="Email address"
                  required
                />
              </div>

              <div className="field password-field">
                <span className="field__icon" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="5"
                      y="10"
                      width="14"
                      height="10"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M8 10V7a4 4 0 1 1 8 0v3"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  autoComplete="new-password"
                  aria-label="Password"
                  required
                />
                <button
                  type="button"
                  className="field__suffix"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <VisibilityOff fontSize="small" />
                  ) : (
                    <Visibility fontSize="small" />
                  )}
                </button>
              </div>

              <div className="field password-field">
                <span className="field__icon" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="5"
                      y="10"
                      width="14"
                      height="10"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M8 10V7a4 4 0 1 1 8 0v3"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                  </svg>
                </span>
                <input
                  type={showVerifyPassword ? "text" : "password"}
                  placeholder="Verify Password"
                  value={verifyPassword}
                  onChange={(e) => setVerifyPassword(e.target.value)}
                  className="input"
                  autoComplete="new-password"
                  aria-label="Verify Password"
                  required
                />
                <button
                  type="button"
                  className="field__suffix"
                  onClick={() => setShowVerifyPassword((prev) => !prev)}
                  aria-label={
                    showVerifyPassword ? "Hide password" : "Show password"
                  }
                >
                  {showVerifyPassword ? (
                    <VisibilityOff fontSize="small" />
                  ) : (
                    <Visibility fontSize="small" />
                  )}
                </button>
              </div>

              <button
                className="btn btn--primary"
                type="submit"
                disabled={loading}
              >
                {loading ? <span className="spinner" aria-hidden /> : "Sign Up"}
              </button>

              <div className="divider"></div>
            </form>
          )}

          <footer className="auth__footer">
            <span>Already have an account?</span>
            <a className="link" href="/login">
              Log In
            </a>
          </footer>
        </section>
      </main>
    </div>
  );
};

export default SignupPage;
