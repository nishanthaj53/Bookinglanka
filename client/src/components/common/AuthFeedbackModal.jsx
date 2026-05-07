import Modal from "react-bootstrap/Modal";
import "./AuthFeedbackModal.css";

const defaultTitles = {
  success: "Signed in successfully",
  error: "Unable to sign in",
  warning: "Wrong sign-in page",
};

/**
 * In-app feedback for auth flows — matches Booking Lanka / Gotur login styling
 * instead of the browser alert().
 */
export default function AuthFeedbackModal({
  show,
  onHide,
  variant = "error",
  title,
  message,
  detail,
  confirmLabel = "OK",
  onConfirm,
  /** When true, only the primary button dismisses (e.g. success or redirect). */
  mustConfirm = false,
}) {
  const resolvedTitle = title || defaultTitles[variant] || defaultTitles.error;

  const handlePrimary = () => {
    if (typeof onConfirm === "function") onConfirm();
    else onHide?.();
  };

  return (
    <Modal
      show={show}
      onHide={mustConfirm ? () => {} : onHide || (() => {})}
      centered
      className="booking-lanka-auth-modal"
      contentClassName="booking-lanka-auth-modal__content"
      backdropClassName="booking-lanka-auth-modal__backdrop"
      backdrop={mustConfirm ? "static" : true}
      keyboard={!mustConfirm}
    >
      <Modal.Body className="booking-lanka-auth-modal__body">
        <div
          className={`booking-lanka-auth-modal__icon-ring booking-lanka-auth-modal__icon-ring--${variant}`}
          aria-hidden
        >
          <span className="booking-lanka-auth-modal__glyph">
            {variant === "success" ? "✓" : variant === "warning" ? "!" : "×"}
          </span>
        </div>
        <h3 className="booking-lanka-auth-modal__title">{resolvedTitle}</h3>
        {message ? <p className="booking-lanka-auth-modal__message">{message}</p> : null}
        {detail ? <p className="booking-lanka-auth-modal__detail">{detail}</p> : null}
        <button type="button" className="gotur-btn w-100" onClick={handlePrimary}>
          {confirmLabel}
        </button>
      </Modal.Body>
    </Modal>
  );
}
