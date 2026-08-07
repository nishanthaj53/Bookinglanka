import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import LoginPageLayout from '../../components/dashboard/LoginPageLayout'
import { resendVerification, verifyEmail } from '../../services/auth'
import { feedbackError, feedbackSuccess, useFeedback } from '../../context/FeedbackContext'

const HERO = '/images/login/user-sri-lanka.jpg'

export default function VerifyEmailPage() {
  const { showFeedback } = useFeedback()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const token = useMemo(
    () => String(searchParams.get('token') || '').trim(),
    [searchParams]
  )
  const portal = useMemo(
    () => (searchParams.get('portal') === 'manager' ? 'manager' : 'user'),
    [searchParams]
  )

  const [status, setStatus] = useState(token ? 'loading' : 'missing')
  const [resendEmail, setResendEmail] = useState('')
  const [resendLoading, setResendLoading] = useState(false)

  const loginPath = portal === 'manager' ? '/manager/login' : '/login'
  const signupPath = portal === 'manager' ? '/manager/signup' : '/signup'

  useEffect(() => {
    document.title = 'Verify Email || Booking Lanka'
  }, [])

  useEffect(() => {
    if (!token) return

    let cancelled = false
    ;(async () => {
      try {
        const data = await verifyEmail(token)
        if (cancelled) return
        setStatus('success')
        feedbackSuccess(showFeedback, data.message || 'Email verified successfully.', {
          title: 'Email verified',
          mustConfirm: true,
          confirmLabel: 'Continue to login',
          onConfirm: () => navigate(loginPath, { replace: true }),
        })
      } catch (err) {
        if (cancelled) return
        setStatus('error')
        feedbackError(showFeedback, err.message || 'Verification failed')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [token, showFeedback, navigate, loginPath])

  const onResend = async (e) => {
    e.preventDefault()
    setResendLoading(true)
    try {
      const data = await resendVerification(resendEmail.trim(), portal)
      feedbackSuccess(showFeedback, data.message || 'Verification email sent if applicable.', {
        title: 'Email sent',
      })
    } catch (err) {
      feedbackError(showFeedback, err.message || 'Could not resend email')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <LoginPageLayout
      title="Verify Email"
      heroImageSrc={HERO}
      heroImageAlt="Sri Lanka tourism — travel destination"
    >
      <div className="login-page__content">
        <div className="login-page__main-tab-box tabs-box">
          <div className="login-page__top">
            <div className="login-page__top__left">
              <h2 className="login-page__top__section-title">Email verification</h2>
              <p className="login-page__top__section-subtitle">
                Confirm your email to activate your Booking Lanka account
              </p>
            </div>
          </div>

          {status === 'loading' && (
            <p style={{ marginTop: 8 }}>Verifying your email address…</p>
          )}

          {(status === 'error' || status === 'missing') && (
            <>
              {status === 'missing' && (
                <p style={{ lineHeight: 1.7 }}>
                  Open the verification link from your email, or request a new one below.
                </p>
              )}

              <form onSubmit={onResend} style={{ marginTop: 16 }}>
                <div className="login-page__group">
                  <div className="login-page__input-box">
                    <i className="icon-email" />
                    <input
                      type="email"
                      placeholder="Your email address"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="login-page__input-box">
                    <button
                      type="submit"
                      className="gotur-btn w-100"
                      disabled={resendLoading}
                    >
                      {resendLoading ? 'Sending…' : 'Resend verification email'}
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}

          <div className="login-page__divider" />
          <p className="login-page__form__text text-center">
            <Link to={loginPath} className="login-page__signup-link">
              Back to login
            </Link>
            {' · '}
            <Link to={signupPath} className="login-page__signup-link">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </LoginPageLayout>
  )
}
