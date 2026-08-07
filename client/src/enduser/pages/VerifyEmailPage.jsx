import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import LoginPageLayout from '../../components/dashboard/LoginPageLayout'
import { resendVerification, verifyEmail } from '../../services/auth'

const HERO = '/images/login/user-sri-lanka.jpg'

export default function VerifyEmailPage() {
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
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [resendEmail, setResendEmail] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState('')

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
        setMessage(data.message || 'Email verified successfully.')
      } catch (err) {
        if (cancelled) return
        setStatus('error')
        setError(err.message || 'Verification failed')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [token])

  const onResend = async (e) => {
    e.preventDefault()
    setResendMessage('')
    setResendLoading(true)
    try {
      const data = await resendVerification(resendEmail.trim(), portal)
      setResendMessage(data.message || 'Verification email sent if applicable.')
    } catch (err) {
      setResendMessage(err.message || 'Could not resend email')
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

          {status === 'success' && (
            <>
              <p style={{ color: '#15803d', lineHeight: 1.7 }}>{message}</p>
              <div className="login-page__input-box" style={{ marginTop: 16 }}>
                <button
                  type="button"
                  className="gotur-btn w-100"
                  onClick={() => navigate(loginPath, { replace: true })}
                >
                  Continue to login
                </button>
              </div>
            </>
          )}

          {(status === 'error' || status === 'missing') && (
            <>
              {status === 'missing' && (
                <p style={{ lineHeight: 1.7 }}>
                  Open the verification link from your email, or request a new one below.
                </p>
              )}
              {!!error && <p style={{ color: '#b91c1c', lineHeight: 1.7 }}>{error}</p>}

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

              {!!resendMessage && (
                <p style={{ color: '#15803d', marginTop: 10, lineHeight: 1.6 }}>
                  {resendMessage}
                </p>
              )}
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
