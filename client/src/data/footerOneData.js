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
    addressLine: SITE_CONTACT.addressLine,
    mapsSearchUrl: SITE_CONTACT.mapsSearchUrl,
    hours: SITE_CONTACT.hours,
  },

  about: {
    text:
      "Booking Lanka helps you discover and book the best hotels with ease. Trusted by travelers across Sri Lanka.",
    socials: [
      {
        icon: "fab fa-facebook-f",
        link: "#",
        label: "Facebook",
      },
      {
        icon: "fab fa-instagram",
        link: "#",
        label: "Instagram",
      },
      {
        icon: "fab fa-twitter",
        link: "#",
        label: "Twitter",
      },
    ],
  },

  destinations: [
    { title: "Colombo", href: "#" },
    { title: "Kandy", href: "#" },
    { title: "Galle", href: "#" },
    { title: "Ella", href: "#" },
  ],

  usefulLinks: [
    { title: "About Us", href: "/about" },
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms & Conditions", href: "/terms" },
    { title: "Contact", href: "/contact" },
  ],

  newsletter: {
    text: "Subscribe to get the latest hotel deals and travel updates.",
    privacyLink: "/privacy",
  },
};
