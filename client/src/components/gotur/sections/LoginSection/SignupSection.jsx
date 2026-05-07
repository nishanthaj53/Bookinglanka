import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../../../services/auth";
import PasswordVisibilityToggle from "../../../common/PasswordVisibilityToggle";

const SIGNUP_HERO = "/images/login/user-sri-lanka.jpg";

export default function SignupSection() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      alert("Password and confirm password must match.");
      return;
    }
    setLoading(true);
    try {
      const res = await signup(data.email, data.password);

      localStorage.setItem("accessToken", res.tokens.accessToken);
      localStorage.setItem("refreshToken", res.tokens.refreshToken);

      alert("Signup successful!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      alert("Signup failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page section-space">
      <div className="container">
        <div className="row gutter-y-40 align-items-center">

          {/* LEFT IMAGE */}
          <div className="col-lg-6">
            <div className="login-page__thumb">
              <img
                src={SIGNUP_HERO}
                alt="Sri Lanka tourism — Sigiriya historic landmark and travel destination"
              />
            </div>
          </div>

          {/* RIGHT FORM */}
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
                        placeholder="Create a password"
                        autoComplete="new-password"
                        {...register("password", { required: true })}
                      />
                      <PasswordVisibilityToggle
                        visible={showPassword}
                        onToggle={() => setShowPassword((prev) => !prev)}
                      />
                    </div>

                    {/* CONFIRM PASSWORD */}
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

                    {/* TERMS */}
                    <div className="login-page__input-box login-page__input-box--bottom">
                      <div className="login-page__input-box__inner">
                        <input id="terms" type="checkbox" required />
                        <label htmlFor="terms">
                          I agree to the Terms & Conditions 
                        </label>
                      </div>
                    </div>

                    {/* BUTTON */}
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

                {/* LOGIN LINK */}
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
