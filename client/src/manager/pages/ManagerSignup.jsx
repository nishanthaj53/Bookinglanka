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
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Password and confirm password must match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/manager/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      alert("Signup successful! You can now log in.");
      navigate("/manager/login");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

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
