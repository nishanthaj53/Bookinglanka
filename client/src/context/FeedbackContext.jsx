import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import AuthFeedbackModal from "../components/common/AuthFeedbackModal";

const initial = {
  show: false,
  variant: "error",
  title: "",
  message: "",
  detail: "",
  confirmLabel: "OK",
  cancelLabel: "",
  mustConfirm: false,
};

const FeedbackContext = createContext(null);

export function FeedbackProvider({ children }) {
  const [s, setS] = useState(initial);
  const onConfirmRef = useRef(null);
  const onCancelRef = useRef(null);

  const showFeedback = useCallback((partial) => {
    const { onConfirm, onCancel, ...rest } = partial;
    onConfirmRef.current = typeof onConfirm === "function" ? onConfirm : null;
    onCancelRef.current = typeof onCancel === "function" ? onCancel : null;
    setS({ ...initial, ...rest, show: true });
  }, []);

  const hideFeedback = useCallback(() => {
    onConfirmRef.current = null;
    onCancelRef.current = null;
    setS(initial);
  }, []);

  const handleConfirm = useCallback(() => {
    const fn = onConfirmRef.current;
    onConfirmRef.current = null;
    onCancelRef.current = null;
    setS(initial);
    fn?.();
  }, []);

  const handleCancel = useCallback(() => {
    const fn = onCancelRef.current;
    onConfirmRef.current = null;
    onCancelRef.current = null;
    setS(initial);
    fn?.();
  }, []);

  return (
    <FeedbackContext.Provider value={{ showFeedback, hideFeedback }}>
      {children}
      <AuthFeedbackModal
        show={s.show}
        onHide={hideFeedback}
        variant={s.variant}
        title={s.title}
        message={s.message}
        detail={s.detail}
        confirmLabel={s.confirmLabel}
        cancelLabel={s.cancelLabel || undefined}
        mustConfirm={s.mustConfirm}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) {
    throw new Error("useFeedback must be used within FeedbackProvider");
  }
  return ctx;
}

/**
 * Convenience helpers for common feedback types.
 */
export function feedbackSuccess(showFeedback, message, opts = {}) {
  showFeedback({
    variant: "success",
    title: opts.title || "Success",
    message,
    detail: opts.detail,
    confirmLabel: opts.confirmLabel || "OK",
    mustConfirm: opts.mustConfirm ?? false,
    onConfirm: opts.onConfirm,
  });
}

export function feedbackError(showFeedback, message, opts = {}) {
  showFeedback({
    variant: "error",
    title: opts.title || "Something went wrong",
    message,
    detail: opts.detail,
    confirmLabel: opts.confirmLabel || "OK",
    mustConfirm: opts.mustConfirm ?? false,
    onConfirm: opts.onConfirm,
  });
}

export function feedbackWarning(showFeedback, message, opts = {}) {
  showFeedback({
    variant: "warning",
    title: opts.title || "Please note",
    message,
    detail: opts.detail,
    confirmLabel: opts.confirmLabel || "OK",
    cancelLabel: opts.cancelLabel,
    mustConfirm: opts.mustConfirm ?? false,
    onConfirm: opts.onConfirm,
    onCancel: opts.onCancel,
  });
}

/** Promise-based confirm dialog using the same styled modal. */
export function askConfirm(showFeedback, {
  title = "Are you sure?",
  message,
  detail,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "warning",
} = {}) {
  return new Promise((resolve) => {
    showFeedback({
      variant,
      title,
      message,
      detail,
      confirmLabel,
      cancelLabel,
      mustConfirm: true,
      onConfirm: () => resolve(true),
      onCancel: () => resolve(false),
    });
  });
}

/** Extract API error message from axios-style errors. */
export function apiErrorMessage(err, fallback = "Request failed") {
  return err?.response?.data?.error || err?.message || fallback;
}
