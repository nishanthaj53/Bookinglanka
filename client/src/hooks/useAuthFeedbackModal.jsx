import { useState, useCallback, useRef } from "react";
import AuthFeedbackModal from "../components/common/AuthFeedbackModal";

const initial = {
  show: false,
  variant: "error",
  title: "",
  message: "",
  detail: "",
  confirmLabel: "OK",
  mustConfirm: false,
};

/**
 * Booking Lanka–styled auth messages (replaces alert()).
 * Pass `onConfirm` in showFeedback for success / portal redirect; it runs after the modal closes.
 */
export function useAuthFeedbackModal() {
  const [s, setS] = useState(initial);
  const onConfirmRef = useRef(null);

  const showFeedback = useCallback((partial) => {
    const { onConfirm, ...rest } = partial;
    onConfirmRef.current = typeof onConfirm === "function" ? onConfirm : null;
    setS({ ...initial, ...rest, show: true });
  }, []);

  const hideFeedback = useCallback(() => {
    onConfirmRef.current = null;
    setS(initial);
  }, []);

  const handleConfirm = useCallback(() => {
    const fn = onConfirmRef.current;
    onConfirmRef.current = null;
    setS(initial);
    fn?.();
  }, []);

  const AuthFeedbackModalSlot = (
    <AuthFeedbackModal
      show={s.show}
      onHide={hideFeedback}
      variant={s.variant}
      title={s.title}
      message={s.message}
      detail={s.detail}
      confirmLabel={s.confirmLabel}
      mustConfirm={s.mustConfirm}
      onConfirm={handleConfirm}
    />
  );

  return { showFeedback, hideFeedback, AuthFeedbackModalSlot };
}
