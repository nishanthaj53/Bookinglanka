import FeedbackRedirect from "../../components/common/FeedbackRedirect";
import { isTokenExpired, isUserToken, isManagerToken } from "../../utils/tokenUtils";

export default function ProtectedUserRoute({ children }) {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("managerAccessToken");

  if (!token) {
    return (
      <FeedbackRedirect
        to="/login"
        variant="warning"
        title="Sign in required"
        message="Please login to continue."
      />
    );
  }

  if (isTokenExpired(token)) {
    return (
      <FeedbackRedirect
        to="/login"
        variant="warning"
        title="Session expired"
        message="Your session has expired. Please login again."
        onBeforeNavigate={() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("managerAccessToken");
        }}
      />
    );
  }

  if (isManagerToken(token)) {
    return (
      <FeedbackRedirect
        to="/manager/login"
        variant="warning"
        title="Wrong portal"
        message="Manager accounts are not authorized on the traveller dashboard."
        detail="We will open the manager sign-in page for your account."
        onBeforeNavigate={() => localStorage.removeItem("managerAccessToken")}
      />
    );
  }

  if (isUserToken(token)) {
    return children;
  }

  return (
    <FeedbackRedirect
      to="/login"
      variant="error"
      title="Unauthorized"
      message="Unauthorized access. Please login again."
      onBeforeNavigate={() => localStorage.removeItem("accessToken")}
    />
  );
}
