// ===== IMAGES (relative paths only) =====
import { SITE_CONTACT } from "./siteContact";
import logo from "../assets/images/logo-light.png";
import cardImage from "../assets/images/shapes/plan.png";
import shape1 from "../assets/images/shapes/footer-shape-1-1.png";
import shape2 from "../assets/images/shapes/footer-shape-1-2.png";

export const footerOneData = {
  logo,
  cardImage,
  shape1,
  shape2,

  contact: {
    email: SITE_CONTACT.email,
    phone: SITE_CONTACT.phone,
    phoneTel: SITE_CONTACT.phoneTel,
    whatsappUrl: SITE_CONTACT.whatsappUrl,
    addressLine: SITE_CONTACT.addressLine,
    mapsSearchUrl: SITE_CONTACT.mapsSearchUrl,
    hours: SITE_CONTACT.hours,
    companyName: SITE_CONTACT.companyName,
  },
};
