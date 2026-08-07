import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import LoginPageLayout from "../../components/dashboard/LoginPageLayout";
import PasswordVisibilityToggle from "../../components/common/PasswordVisibilityToggle";

export default function ManagerSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Password and confirm password must match.");
      return;
    }
    setLoading(true);
    setError("");
    setResendMessage("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/manager/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      if (data.requiresVerification) {
        setRegisteredEmail(data.user?.email || email);
        return;
      }

      navigate("/manager/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    if (!registeredEmail) return;
    setResendLoading(true);
    setResendMessage("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registeredEmail, portal: "manager" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not resend email");
      setResendMessage(data.message || "Verification email sent.");
    } catch (err) {
      setResendMessage(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  if (registeredEmail) {
    return (
      <LoginPageLayout
        title="Verify Email"
        heroImageSrc="/images/login/manager-hotel.jpg"
        heroImageAlt="Luxury hotel facade"
      >
        <div className="login-page__content">
          <div className="login-page__top mb-4">
            <h2 className="login-page__top__section-title">Check your email</h2>
            <p className="login-page__top__section-subtitle">
              Verify your manager account to access the portal
            </p>
          </div>
          <p style={{ lineHeight: 1.7, marginBottom: 16 }}>
            We sent a verification link to <strong>{registeredEmail}</strong>. After verifying,
            sign in at the manager login page.
          </p>
          <div className="login-page__input-box">
            <button
              type="button"
              className="gotur-btn w-100"
              disabled={resendLoading}
              onClick={onResend}
            >
              {resendLoading ? "Sending…" : "Resend verification email"}
            </button>
          </div>
          {!!resendMessage && (
            <p style={{ color: "#15803d", marginTop: 12 }}>{resendMessage}</p>
          )}
          <div className="login-page__divider" />
          <p className="login-page__form__text text-center">
            <Link to="/manager/login" className="login-page__signup-link">
              Go to manager login
            </Link>
          </p>
        </div>
      </LoginPageLayout>
    );
  }

  return (
    <LoginPageLayout
      title="Manager Sign Up"
      heroImageSrc="/images/login/manager-hotel.jpg"
      heroImageAlt="Luxury hotel facade — hospitality manager and property frontage"
    >
      <div className="login-page__content">
        <div className="login-page__top mb-4">
          <h2 className="login-page__top__section-title">Create account</h2>
          <p className="login-page__top__section-subtitle">Register to manage hotels and bookings</p>
        </div>
        <Form onSubmit={handleSignup}>
          <div className="login-page__group">
            <div className="login-page__input-box">
              <i className="icon-email" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="login-page__input-box login-page__input-box--password">
              <i className="icon-padlock" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <PasswordVisibilityToggle
                visible={showPassword}
                onToggle={() => setShowPassword((prev) => !prev)}
              />
            </div>
            <div className="login-page__input-box login-page__input-box--password">
              <i className="icon-padlock" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <PasswordVisibilityToggle
                visible={showConfirmPassword}
                onToggle={() => setShowConfirmPassword((prev) => !prev)}
              />
            </div>
            <div className="login-page__input-box">
              <button type="submit" className="gotur-btn w-100" disabled={loading}>
                {loading ? "Creating…" : "Sign Up"}
              </button>
            </div>
          </div>
        </Form>
        {!!error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
        <div className="login-page__divider" />
        <p className="login-page__form__text text-center">
          Already have an account?{" "}
          <Link to="/manager/login" className="login-page__signup-link">
            Log in
          </Link>
        </p>
      </div>
    </LoginPageLayout>
  );
}
