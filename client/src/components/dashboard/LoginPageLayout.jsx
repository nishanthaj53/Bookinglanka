/**
 * Full-page login layout matching end-user Sign In (split hero image + form).
 * Same shell as gotur: Layout, Topbar, Header, Footer — no extra page banner.
 */
import { useEffect } from "react";
import Layout from "../gotur/layout/Layout/Layout";
import TopbarOne from "../gotur/common/TopbarOne/TopbarOne";
import HeaderTwo from "../gotur/layout/HeaderTwo/HeaderTwo";
import HeaderTwoCloned from "../gotur/layout/HeaderTwoCloned/HeaderTwoCloned";
import FooterOne from "../gotur/layout/FooterOne/FooterOne";

export default function LoginPageLayout({
  title,
  heroImageSrc,
  heroImageAlt = "",
  children,
}) {
  useEffect(() => {
    if (title) document.title = `${title} || Booking Lanka`;
  }, [title]);

  return (
    <Layout>
      <TopbarOne />
      <HeaderTwo />
      <HeaderTwoCloned />
      <section className="login-page section-space">
        <div className="container">
          <div className="row gutter-y-40 align-items-center">
            <div className="col-lg-6">
              <div className="login-page__thumb">
                <img src={heroImageSrc} alt={heroImageAlt} />
              </div>
            </div>
            <div className="col-lg-6">{children}</div>
          </div>
        </div>
      </section>
      <FooterOne />
    </Layout>
  );
}
