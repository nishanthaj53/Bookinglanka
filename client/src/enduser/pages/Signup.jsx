import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { signup } from "../../services/auth"
import {
  apiErrorMessage,
  feedbackError,
  feedbackSuccess,
  feedbackWarning,
  useFeedback,
} from "../../context/FeedbackContext"

export default function Signup() {
  const { showFeedback } = useFeedback()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      feedbackWarning(showFeedback, "Password and confirm password must match.")
      return
    }
    setLoading(true)

    try {
      const res = await signup(email, password)
      localStorage.setItem("accessToken", res.tokens.accessToken)
      localStorage.setItem("refreshToken", res.tokens.refreshToken)
      feedbackSuccess(showFeedback, "Signup successful!", {
        title: "Welcome",
        onConfirm: () => navigate("/dashboard"),
      })
    } catch (err) {
      feedbackError(showFeedback, apiErrorMessage(err, "Signup failed"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: "10px" }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "10px" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ display: "block", width: "100%", flex: 1 }}
          />
          <button type="button" onClick={() => setShowPassword((p) => !p)} style={{ whiteSpace: "nowrap" }}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "10px" }}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ display: "block", width: "100%", flex: 1 }}
          />
          <button type="button" onClick={() => setShowConfirmPassword((p) => !p)} style={{ whiteSpace: "nowrap" }}>
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <p>
        Already registered? <a href="/login">Login</a>
      </p>
    </div>
  )
}
