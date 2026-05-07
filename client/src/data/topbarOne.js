import { SITE_CONTACT } from "./siteContact";

export const topbarOne = {
  contactInfo: [
    {
      type: "phone",
      iconClass: "icon-telephone",
      label: SITE_CONTACT.phone,
      href: `tel:${SITE_CONTACT.phoneTel}`,
    },
    {
      type: "email",
      iconClass: "icon-email",
      label: SITE_CONTACT.email,
      href: `mailto:${SITE_CONTACT.email}`,
    },
  ],
  address: {
    iconClass: "icon-location",
    label: SITE_CONTACT.addressLine,
    href: SITE_CONTACT.mapsSearchUrl,
  },
  socialLinks: [
    { platform: "facebook", iconClass: "fab fa-facebook-f", href: "#" },
    { platform: "x", iconClass: "fab fa-x-twitter", href: "#" },
    { platform: "linkedin", iconClass: "fab fa-linkedin-in", href: "#" },
    { platform: "youtube", iconClass: "fab fa-youtube", href: "#" },
  ],
};
