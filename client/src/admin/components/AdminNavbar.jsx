import { useNavigate } from "react-router-dom"

export default function AdminNavbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    navigate("/admin/login")
  }

  return (
    <nav
      style={{
        background: "#333",
        color: "white",
        padding: "10px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>
        <strong>Admin Panel</strong>
      </div>

      <div>
        <button
          onClick={handleLogout}
          style={{
            background: "red",
            border: "none",
            color: "white",
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
