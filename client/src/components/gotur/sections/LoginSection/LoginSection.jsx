import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { login, resendVerification } from "../../../../services/auth";
import { useAuthFeedbackModal } from "../../../../hooks/useAuthFeedbackModal";
import PasswordVisibilityToggle from "../../../common/PasswordVisibilityToggle";

const USER_LOGIN_HERO = "/images/login/user-sri-lanka.jpg";

export default function LoginSection() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { showFeedback, AuthFeedbackModalSlot } = useAuthFeedbackModal();

  const redirectParam = new URLSearchParams(location.search).get("redirect");

  const { register, handleSubmit } = useForm();

  const handleLogin = async (data) => {
    setLoading(true);
    try {
      const res = await login(data.email, data.password);

      localStorage.removeItem("managerAccessToken");
      localStorage.removeItem("managerRefreshToken");
      localStorage.removeItem("adminAccessToken");
      localStorage.removeItem("adminRefreshToken");

      localStorage.setItem("accessToken", res.tokens.accessToken);
      localStorage.setItem("refreshToken", res.tokens.refreshToken);

      localStorage.removeItem("pendingBooking");

      showFeedback({
        variant: "success",
        title: "Welcome back",
        message:
          "You are signed in to Booking Lanka. Continue to your traveller dashboard when you are ready.",
        confirmLabel: "Continue",
        mustConfirm: true,
        onConfirm: () => {
          if (redirectParam && redirectParam.includes("/hotels/")) {
            const hotelId = redirectParam.split("/hotels/")[1];
            navigate(`/dashboard/hotels/${hotelId}`, { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
        },
      });
    } catch (err) {
      if (err.redirectPath) {
        showFeedback({
          variant: "warning",
          title: "Wrong sign-in page",
          message:
            err.message || "You are not permitted to access this portal.",
          detail:
            "We will open the correct Booking Lanka sign-in for your account.",
          confirmLabel: "Continue",
          mustConfirm: true,
          onConfirm: () => navigate(err.redirectPath, { replace: true }),
        });
      } else if (err.code === "EMAIL_NOT_VERIFIED") {
        showFeedback({
          variant: "warning",
          title: "Verify your email",
          message:
            err.message ||
            "Please verify your email before signing in.",
          detail:
            "Check your inbox for the verification link, or request a new one.",
          confirmLabel: "Resend verification email",
          mustConfirm: true,
          onConfirm: async () => {
            try {
              await resendVerification(err.email || "", "user");
              showFeedback({
                variant: "success",
                title: "Email sent",
                message:
                  "If your account is not yet verified, a new verification link has been sent.",
              });
            } catch (resendErr) {
              showFeedback({
                variant: "error",
                message: resendErr.message || "Could not resend verification email.",
              });
            }
          },
        });
      } else {
        showFeedback({
          variant: "error",
          message: err.message || "Sign-in failed. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <section className="login-page section-space">
      <div className="container">
        <div className="row gutter-y-40 align-items-center">

          {/* LEFT IMAGE */}
          <div className="col-lg-6">
            <div className="login-page__thumb">
              <img
                src={USER_LOGIN_HERO}
                alt="Sri Lanka tourism — Sigiriya historic landmark and travel destination"
              />
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="col-lg-6">
            <div className="login-page__content">
              <div className="login-page__main-tab-box tabs-box">

                {/* HEADER */}
                <div className="login-page__top">
                  <div className="login-page__top__left">
                    <h2 className="login-page__top__section-title">
                      Welcome
                    </h2>
                    <p className="login-page__top__section-subtitle">
                      Sign in your account
                    </p>
                  </div>
                </div>

                {/* LOGIN FORM */}
                <div className="tabs-content">
                  <div className="tabs-content__item tab active-tab">
                    <Form onSubmit={handleSubmit(handleLogin)}>
                      <div className="login-page__group">

                        {/* EMAIL */}
                        <div className="login-page__input-box">
                          <i className="icon-email"></i>
                          <input
                            type="text"
                            placeholder="Enter your email"
                            {...register("email", { required: true })}
                          />
                        </div>

                        {/* PASSWORD */}
                        <div className="login-page__input-box login-page__input-box--password">
                          <i className="icon-padlock"></i>
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            autoComplete="current-password"
                            {...register("password", { required: true })}
                          />
                          <PasswordVisibilityToggle
                            visible={showPassword}
                            onToggle={() => setShowPassword((prev) => !prev)}
                          />
                        </div>

                        {/* REMEMBER + FORGOT */}
                        <div className="login-page__input-box login-page__input-box--bottom">
                          <div className="login-page__input-box__inner">
                            <input id="rememberMe" type="checkbox" />
                            <label htmlFor="rememberMe">Remember me</label>
                          </div>

                          <Link to="/forgot-password" className="login-page__form__forgot">
                            Forgot password?
                          </Link>
                        </div>

                        {/* BUTTON */}
                        <div className="login-page__input-box">
                          <button
                            type="submit"
                            className="gotur-btn w-100"
                            disabled={loading}
                          >
                            {loading ? "Logging in..." : "Log In"}
                          </button>
                        </div>

                      </div>
                    </Form>

                    {/* SIGNUP CTA */}
                    <div className="login-page__divider"></div>

                    <p className="login-page__form__text text-center">
                      Are you a new user?
                      <Link
                        to="/signup"
                        className="login-page__signup-link"
                      >
                        Create an account
                      </Link>
                    </p>

                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
    {AuthFeedbackModalSlot}
    </>
  );
}
