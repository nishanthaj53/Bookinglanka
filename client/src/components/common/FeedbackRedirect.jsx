import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFeedback } from "../../context/FeedbackContext";

/**
 * Shows the app feedback modal, then navigates when the user confirms.
 * Used by protected-route guards instead of browser alert().
 */
export default function FeedbackRedirect({
  to,
  variant = "warning",
  title,
  message,
  detail,
  confirmLabel = "OK",
  onBeforeNavigate,
}) {
  const navigate = useNavigate();
  const { showFeedback } = useFeedback();
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    showFeedback({
      variant,
      title,
      message,
      detail,
      confirmLabel,
      mustConfirm: true,
      onConfirm: () => {
        onBeforeNavigate?.();
        navigate(to, { replace: true });
      },
    });
  }, [
    to,
    variant,
    title,
    message,
    detail,
    confirmLabel,
    showFeedback,
    navigate,
    onBeforeNavigate,
  ]);

  return null;
}
