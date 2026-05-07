import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { login } from "../../services/auth"
import { useAuthFeedbackModal } from "../../hooks/useAuthFeedbackModal"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { showFeedback, AuthFeedbackModalSlot } = useAuthFeedbackModal()

  // Capture ?redirect param (example: /hotels/638e29a5-d518-4e66-9c64-9e5b5891108f)
  const redirectParam = new URLSearchParams(location.search).get("redirect")

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await login(email, password)

      // ✅ Store tokens
      localStorage.removeItem("managerAccessToken")
      localStorage.removeItem("managerRefreshToken")
      localStorage.removeItem("adminAccessToken")
      localStorage.removeItem("adminRefreshToken")
      localStorage.setItem("accessToken", res.tokens.accessToken)
      localStorage.setItem("refreshToken", res.tokens.refreshToken)

      localStorage.removeItem("pendingBooking")

      showFeedback({
        variant: "success",
        title: "Welcome back",
        message:
          "You are signed in to Booking Lanka. Continue to your traveller dashboard when you are ready.",
        confirmLabel: "Continue",
        mustConfirm: true,
        onConfirm: () => {
          if (redirectParam && redirectParam.includes("/hotels/")) {
            const hotelId = redirectParam.split("/hotels/")[1]
            navigate(`/dashboard/hotels/${hotelId}`, { replace: true })
          } else {
            navigate("/dashboard", { replace: true })
          }
        },
      })
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
        })
      } else {
        showFeedback({
          variant: "error",
          message: err.message || "Sign-in failed. Please try again.",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ display: "block", width: "100%", flex: 1 }}
          />
          <button type="button" onClick={() => setShowPassword((p) => !p)} style={{ whiteSpace: "nowrap" }}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={{ marginTop: "10px" }}>
        No account? <a href="/signup">Signup here</a>
      </p>
    </div>
    {AuthFeedbackModalSlot}
    </>
  )
}
