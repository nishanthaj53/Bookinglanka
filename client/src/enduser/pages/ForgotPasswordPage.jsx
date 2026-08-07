import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Form } from 'react-bootstrap'
import LoginPageLayout from '../../components/dashboard/LoginPageLayout'
import { forgotPassword } from '../../services/auth'

const HERO = '/images/login/user-sri-lanka.jpg'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Forgot Password || Booking Lanka'
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      const data = await forgotPassword(email.trim())
      setMessage(data.message || 'If this email is registered, a reset link has been sent.')
      setEmail('')
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <LoginPageLayout
      title="Forgot Password"
      heroImageSrc={HERO}
      heroImageAlt="Sri Lanka tourism — travel destination"
    >
      <div className="login-page__content">
        <div className="login-page__main-tab-box tabs-box">
          <div className="login-page__top">
            <div className="login-page__top__left">
              <h2 className="login-page__top__section-title">Forgot password?</h2>
              <p className="login-page__top__section-subtitle">
                Enter your email and we&apos;ll send you a secure reset link
              </p>
            </div>
          </div>

          <Form onSubmit={onSubmit}>
            <div className="login-page__group">
              <div className="login-page__input-box">
                <i className="icon-email" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="login-page__input-box">
                <button type="submit" className="gotur-btn w-100" disabled={loading}>
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
              </div>
            </div>
          </Form>

          {!!message && (
            <p style={{ color: '#15803d', marginTop: 12, lineHeight: 1.6 }}>{message}</p>
          )}
          {!!error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}

          <div className="login-page__divider" />
          <p className="login-page__form__text text-center">
            Remember your password?{' '}
            <Link to="/login" className="login-page__signup-link">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </LoginPageLayout>
  )
}
