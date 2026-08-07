import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import LoginPageLayout from "../../components/dashboard/LoginPageLayout";
import PasswordVisibilityToggle from "../../components/common/PasswordVisibilityToggle";
import { resetPassword } from "../../services/auth";

const RESET_HERO = "/images/login/user-sri-lanka.jpg";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tokenFromUrl = useMemo(
    () => String(searchParams.get("token") || "").trim(),
    [searchParams]
  );

  const [token, setToken] = useState(tokenFromUrl);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setMessage("");
      if (!token) throw new Error("Reset token is missing.");
      if (password.length < 8) throw new Error("Password must be at least 8 characters.");
      if (password !== confirmPassword) throw new Error("Passwords do not match.");

      setLoading(true);
      await resetPassword(token, password);

      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginPageLayout
      title="Reset Password"
      heroImageSrc={RESET_HERO}
      heroImageAlt="Reset password"
    >
      <div className="login-page__content">
        <div className="login-page__main-tab-box tabs-box">
          <div className="login-page__top">
            <div className="login-page__top__left">
              <h2 className="login-page__top__section-title">Reset Password</h2>
              <p className="login-page__top__section-subtitle">
                Create a new password for your account
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit}>
            <div className="login-page__group">
              {!tokenFromUrl && (
                <div className="login-page__input-box">
                  <i className="icon-email"></i>
                  <input
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Paste reset token"
                  />
                </div>
              )}
              <div className="login-page__input-box login-page__input-box--password">
                <i className="icon-padlock"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password (min 8 chars)"
                  autoComplete="new-password"
                />
                <PasswordVisibilityToggle
                  visible={showPassword}
                  onToggle={() => setShowPassword((p) => !p)}
                />
              </div>
              <div className="login-page__input-box login-page__input-box--password">
                <i className="icon-padlock"></i>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />
                <PasswordVisibilityToggle
                  visible={showConfirmPassword}
                  onToggle={() => setShowConfirmPassword((p) => !p)}
                />
              </div>
              <div className="login-page__input-box">
                <button className="gotur-btn w-100" type="submit" disabled={loading}>
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </div>
          </form>

          {!!message && <p style={{ color: "#15803d", marginTop: 10 }}>{message}</p>}
          {!!error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
          <p className="login-page__form__text text-center" style={{ marginTop: 14 }}>
            Back to{" "}
            <Link to="/login" className="login-page__signup-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </LoginPageLayout>
  );
}
