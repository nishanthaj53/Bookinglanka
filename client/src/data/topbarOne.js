import { SITE_CONTACT } from "./siteContact";

export const topbarOne = {
  contactInfo: [
    {
      type: "phone",
      iconType: "phone",
      label: SITE_CONTACT.phone,
      href: SITE_CONTACT.whatsappUrl,
      external: true,
    },
    {
      type: "email",
      iconType: "email",
      label: SITE_CONTACT.email,
      href: `mailto:${SITE_CONTACT.email}`,
    },
  ],
  address: {
    iconType: "location",
    label: SITE_CONTACT.addressLine,
    href: SITE_CONTACT.mapsSearchUrl,
  },
  socialLinks: [
    { platform: "facebook", iconClass: "fab fa-facebook-f", href: SITE_CONTACT.facebookUrl },
    { platform: "x", iconClass: "fab fa-x-twitter", href: "#" },
    { platform: "linkedin", iconClass: "fab fa-linkedin-in", href: "#" },
    { platform: "youtube", iconClass: "fab fa-youtube", href: "#" },
  ],
};
