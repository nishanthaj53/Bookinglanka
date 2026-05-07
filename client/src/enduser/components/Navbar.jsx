import { Link, useNavigate } from "react-router-dom"

export default function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    alert("You have logged out.")
    navigate("/login")
  }

  return (
    <nav
      style={{
        background: "#f5f5f5",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>
        <Link to="/dashboard/hotels" style={{ marginRight: "15px" }}>
          Home
        </Link>
        <Link to="/dashboard/bookings" style={{ marginRight: "15px" }}>
          My Bookings
        </Link>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  )
}
