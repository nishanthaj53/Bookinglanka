import { Link } from "react-router-dom";
import { resolveGetInTouchTo } from "../../../utils/resolveDashboardEntry";

/**
 * Header / hero CTA: signed-in users go to the right dashboard; others see login choices.
 */
export default function GetInTouchNavLink({ className, children }) {
  const to = resolveGetInTouchTo();
  return (
    <Link to={to} className={className}>
      {children ?? (
        <>
          Get in touch <i className="icon-paper-plane"></i>
        </>
      )}
    </Link>
  );
}
