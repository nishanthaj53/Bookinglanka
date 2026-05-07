import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminDashboardShell from "../components/AdminDashboardShell";
import { ADMIN_NAV } from "../adminNavConfig";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/admin/dashboard" || location.pathname === "/admin/dashboard/") {
      navigate("/admin/dashboard/hotels/active", { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminRefreshToken");
    navigate("/admin/login");
  };

  return (
    <AdminDashboardShell navItems={ADMIN_NAV} onLogout={handleLogout} />
  );
}
