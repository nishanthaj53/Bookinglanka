import { useFeedback } from "../context/FeedbackContext";

/**
 * @deprecated Modal renders globally via FeedbackProvider. AuthFeedbackModalSlot is no longer needed in JSX.
 */
export function useAuthFeedbackModal() {
  const { showFeedback, hideFeedback } = useFeedback();
  return {
    showFeedback,
    hideFeedback,
    AuthFeedbackModalSlot: null,
  };
}
