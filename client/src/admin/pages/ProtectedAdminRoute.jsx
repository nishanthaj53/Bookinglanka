import FeedbackRedirect from "../../components/common/FeedbackRedirect";
import { isTokenExpired, isAdminToken } from "../../utils/tokenUtils";

export default function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem("adminAccessToken");

  if (!token) {
    return (
      <FeedbackRedirect
        to="/admin/login"
        variant="warning"
        title="Admin sign-in required"
        message="Admin access only. Please login as admin."
      />
    );
  }

  if (isTokenExpired(token)) {
    return (
      <FeedbackRedirect
        to="/admin/login"
        variant="warning"
        title="Session expired"
        message="Session expired. Please login again."
        onBeforeNavigate={() => localStorage.removeItem("adminAccessToken")}
      />
    );
  }

  if (!isAdminToken(token)) {
    return (
      <FeedbackRedirect
        to="/admin/login"
        variant="error"
        title="Access denied"
        message="Access denied. Admins only."
        onBeforeNavigate={() => localStorage.clear()}
      />
    );
  }

  return children;
}
