import FeedbackRedirect from "../../components/common/FeedbackRedirect";
import { isTokenExpired, isManagerToken, isUserToken } from "../../utils/tokenUtils";

export default function ProtectedManagerRoute({ children }) {
  const token = localStorage.getItem("managerAccessToken") || localStorage.getItem("accessToken");

  if (!token) {
    return (
      <FeedbackRedirect
        to="/manager/login"
        variant="warning"
        title="Sign in required"
        message="Please login as manager to continue."
      />
    );
  }

  if (isTokenExpired(token)) {
    return (
      <FeedbackRedirect
        to="/manager/login"
        variant="warning"
        title="Session expired"
        message="Your session has expired. Please login again."
        onBeforeNavigate={() => {
          localStorage.removeItem("managerAccessToken");
          localStorage.removeItem("accessToken");
        }}
      />
    );
  }

  if (isUserToken(token)) {
    return (
      <FeedbackRedirect
        to="/login"
        variant="warning"
        title="Wrong portal"
        message="Traveller accounts are not authorized on the manager dashboard."
        detail="We will open the traveller sign-in page for your account."
        onBeforeNavigate={() => localStorage.removeItem("accessToken")}
      />
    );
  }

  if (isManagerToken(token)) {
    return children;
  }

  return (
    <FeedbackRedirect
      to="/manager/login"
      variant="error"
      title="Unauthorized"
      message="Unauthorized access. Please login again."
      onBeforeNavigate={() => localStorage.removeItem("managerAccessToken")}
    />
  );
}
