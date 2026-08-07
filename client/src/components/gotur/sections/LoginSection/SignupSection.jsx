import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { signup } from "../../../../services/auth";
import PasswordVisibilityToggle from "../../../common/PasswordVisibilityToggle";
import { feedbackError, feedbackWarning, useFeedback } from "../../../../context/FeedbackContext";

const SIGNUP_HERO = "/images/login/user-sri-lanka.jpg";

export default function SignupSection() {
  const { showFeedback } = useFeedback();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      feedbackWarning(showFeedback, "Password and confirm password must match.");
      return;
    }
    setLoading(true);
    setResendMessage("");
    try {
      const res = await signup(data.email, data.password);
      setRegisteredEmail(res.user?.email || data.email);
    } catch (err) {
      feedbackError(showFeedback, err.message || "Signup failed");
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
        body: JSON.stringify({ email: registeredEmail, portal: "user" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not resend email");
      setResendMessage(data.message || "Verification email sent.");
    } catch (err) {
      setResendMessage(err.message || "Could not resend email");
    } finally {
      setResendLoading(false);
    }
  };

  if (registeredEmail) {
    return (
      <section className="login-page section-space">
        <div className="container">
          <div className="row gutter-y-40 align-items-center">
            <div className="col-lg-6">
              <div className="login-page__thumb">
                <img src={SIGNUP_HERO} alt="Sri Lanka tourism" />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="login-page__content">
                <div className="login-page__main-tab-box tabs-box">
                  <div className="login-page__top">
                    <div className="login-page__top__left">
                      <h2 className="login-page__top__section-title">Check your email</h2>
                      <p className="login-page__top__section-subtitle">
                        We sent a verification link to activate your account
                      </p>
                    </div>
                  </div>
                  <p style={{ lineHeight: 1.7, marginBottom: 16 }}>
                    Open the email sent to <strong>{registeredEmail}</strong> and click
                    <strong> Verify email address</strong>. After verifying, you can sign in.
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
                    Already verified?{" "}
                    <Link to="/login" className="login-page__signup-link">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="login-page section-space">
      <div className="container">
        <div className="row gutter-y-40 align-items-center">

          <div className="col-lg-6">
            <div className="login-page__thumb">
              <img
                src={SIGNUP_HERO}
                alt="Sri Lanka tourism — Sigiriya historic landmark and travel destination"
              />
            </div>
          </div>

          <div className="col-lg-6">
            <div className="login-page__content">
              <div className="login-page__main-tab-box tabs-box">

                <div className="login-page__top">
                  <div className="login-page__top__left">
                    <h2 className="login-page__top__section-title">
                      Welcome
                    </h2>
                    <p className="login-page__top__section-subtitle">
                      Sign up to continue your journey with us
                    </p>
                  </div>
                </div>

                <Form onSubmit={handleSubmit(onSubmit)}>
                  <div className="login-page__group">

                    <div className="login-page__input-box">
                      <i className="icon-email"></i>
                      <input
                        type="text"
                        placeholder="Enter your email"
                        {...register("email", { required: true })}
                      />
                    </div>

                    <div className="login-page__input-box login-page__input-box--password">
                      <i className="icon-padlock"></i>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        autoComplete="new-password"
                        {...register("password", { required: true })}
                      />
                      <PasswordVisibilityToggle
                        visible={showPassword}
                        onToggle={() => setShowPassword((prev) => !prev)}
                      />
                    </div>

                    <div className="login-page__input-box login-page__input-box--password">
                      <i className="icon-padlock"></i>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        autoComplete="new-password"
                        {...register("confirmPassword", { required: true })}
                      />
                      <PasswordVisibilityToggle
                        visible={showConfirmPassword}
                        onToggle={() => setShowConfirmPassword((prev) => !prev)}
                      />
                    </div>

                    <div className="login-page__input-box login-page__input-box--bottom">
                      <div className="login-page__input-box__inner">
                        <input id="terms" type="checkbox" required />
                        <label htmlFor="terms">
                          I agree to the Terms & Conditions 
                        </label>
                      </div>
                    </div>

                    <div className="login-page__input-box">
                      <button
                        type="submit"
                        className="gotur-btn"
                        disabled={loading}
                      >
                        {loading ? "Signing up..." : "Sign Up"}
                      </button>
                    </div>

                  </div>
                </Form>

                <p className="login-page__form__text">
                  Already registered?{" "}
                  <Link to="/login" className="text-success">
                    Login
                  </Link>
                </p>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
