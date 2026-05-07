import { SITE_CONTACT } from "./siteContact";

export const contactItems = [
  {
    icon: "icon-pin",
    title: "Our Address",
    text: `${SITE_CONTACT.addressLine}, Colombo, Sri Lanka.`,
    link: SITE_CONTACT.mapsSearchUrl,
  },
  {
    icon: "icon-mail-3",
    title: SITE_CONTACT.email,
    text: "Email us for bookings and inquiries. We're here to help!",
    link: `mailto:${SITE_CONTACT.email}`,
  },
  {
    icon: "icon-call-3",
    title: SITE_CONTACT.phone,
    text: "Call us for booking support and travel assistance.",
    link: `tel:${SITE_CONTACT.phoneTel}`,
  },
];
