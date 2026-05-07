import Layout from "../gotur/layout/Layout/Layout";
import TopbarOne from "../gotur/common/TopbarOne/TopbarOne";
import UserHeaderTwo from "./UserHeaderTwo";

/**
 * Landing-style chrome for the guest dashboard (authenticated area).
 */
export default function UserDashboardGoturLayout({ onLogout, children }) {
  return (
    <Layout>
      <TopbarOne />
      <UserHeaderTwo onLogout={onLogout} />
      <UserHeaderTwo onLogout={onLogout} cloned />
      <div className="user-dashboard-gotur-main">{children}</div>
    </Layout>
  );
}
