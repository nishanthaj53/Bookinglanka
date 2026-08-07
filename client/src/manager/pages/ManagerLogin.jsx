import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import LoginPageLayout from "../../components/dashboard/LoginPageLayout";
import { useAuthFeedbackModal } from "../../hooks/useAuthFeedbackModal";
import PasswordVisibilityToggle from "../../components/common/PasswordVisibilityToggle";

export default function ManagerLogin() {
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
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/manager/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.code === "EMAIL_NOT_VERIFIED") {
          showFeedback({
            variant: "warning",
            title: "Verify your email",
            message: data.error || "Please verify your email before signing in.",
            detail: "Check your inbox for the manager verification link.",
            confirmLabel: "Resend verification email",
            mustConfirm: true,
            onConfirm: async () => {
              try {
                const r = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/resend-verification`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: data.email || email, portal: "manager" }),
                });
                const rd = await r.json();
                if (!r.ok) throw new Error(rd.error || "Could not resend email");
                showFeedback({
                  variant: "success",
                  title: "Email sent",
                  message: rd.message || "Verification email sent if applicable.",
                });
              } catch (resendErr) {
                showFeedback({
                  variant: "error",
                  message: resendErr.message || "Could not resend verification email.",
                });
              }
            },
          });
          return;
        }
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
      localStorage.removeItem("adminAccessToken");
      localStorage.removeItem("adminRefreshToken");

      localStorage.setItem("managerAccessToken", data.tokens.accessToken);
      localStorage.setItem("managerRefreshToken", data.tokens.refreshToken);

      showFeedback({
        variant: "success",
        title: "Welcome, hotel manager",
        message:
          "You are signed in to manage your properties on Booking Lanka. Continue to your manager dashboard when you are ready.",
        confirmLabel: "Go to dashboard",
        mustConfirm: true,
        onConfirm: () => navigate("/manager/dashboard"),
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
      title="Manager Login"
      heroImageSrc="/images/login/manager-hotel.jpg"
      heroImageAlt="Luxury hotel facade — hospitality manager and property frontage"
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
                      <input id="managerRememberMe" type="checkbox" />
                      <label htmlFor="managerRememberMe">Remember me</label>
                    </div>
                    <Link to="/forgot-password" className="login-page__form__forgot">
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
                Are you a new user?{" "}
                <Link to="/manager/signup" className="login-page__signup-link">
                  Create an account
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
