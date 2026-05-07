import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import LoginPageLayout from "../../components/dashboard/LoginPageLayout";
import { useAuthFeedbackModal } from "../../hooks/useAuthFeedbackModal";
import PasswordVisibilityToggle from "../../components/common/PasswordVisibilityToggle";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showFeedback, AuthFeedbackModalSlot } = useAuthFeedbackModal();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.redirectPath) {
          showFeedback({
            variant: "warning",
            title: "Wrong sign-in page",
            message:
              data.error || "You are not permitted to access this portal.",
            detail:
              "We will open the correct Booking Lanka sign-in for your account.",
            confirmLabel: "Continue",
            mustConfirm: true,
            onConfirm: () => navigate(data.redirectPath, { replace: true }),
          });
          return;
        }
        throw new Error(data.error || "Login failed");
      }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("managerAccessToken");
      localStorage.removeItem("managerRefreshToken");

      localStorage.setItem("adminAccessToken", data.tokens.accessToken);
      localStorage.setItem("adminRefreshToken", data.tokens.refreshToken);

      showFeedback({
        variant: "success",
        title: "Welcome, administrator",
        message:
          "You are signed in to the Booking Lanka control centre. Continue to your dashboard when you are ready.",
        confirmLabel: "Go to dashboard",
        mustConfirm: true,
        onConfirm: () => navigate("/admin/dashboard"),
      });
    } catch (err) {
      showFeedback({
        variant: "error",
        message: err.message || "Sign-in failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <LoginPageLayout
      title="Admin Login"
      heroImageSrc="/images/login/admin-system.jpg"
      heroImageAlt="Platform team coordinating and analyzing hotel network performance"
    >
      <div className="login-page__content">
        <div className="login-page__main-tab-box tabs-box">
          <div className="login-page__top">
            <div className="login-page__top__left">
              <h2 className="login-page__top__section-title">Welcome</h2>
              <p className="login-page__top__section-subtitle">Sign in your account</p>
            </div>
          </div>

          <div className="tabs-content">
            <div className="tabs-content__item tab active-tab">
              <Form onSubmit={handleLogin}>
                <div className="login-page__group">
                  <div className="login-page__input-box">
                    <i className="icon-email" />
                    <input
                      type="text"
                      placeholder="Enter your email"
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
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <PasswordVisibilityToggle
                      visible={showPassword}
                      onToggle={() => setShowPassword((prev) => !prev)}
                    />
                  </div>
                  <div className="login-page__input-box login-page__input-box--bottom">
                    <div className="login-page__input-box__inner">
                      <input id="adminRememberMe" type="checkbox" />
                      <label htmlFor="adminRememberMe">Remember me</label>
                    </div>
                    <Link to="#" className="login-page__form__forgot">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="login-page__input-box">
                    <button type="submit" className="gotur-btn w-100" disabled={loading}>
                      {loading ? "Logging in..." : "Log In"}
                    </button>
                  </div>
                </div>
              </Form>

              <div className="login-page__divider" />
              <p className="login-page__form__text text-center">
                Booking and hotel site?{" "}
                <Link to="/" className="login-page__signup-link">
                  Go to homepage
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </LoginPageLayout>
    {AuthFeedbackModalSlot}
    </>
  );
}
