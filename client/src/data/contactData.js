import { SITE_CONTACT } from "./siteContact";

export const contactFormFields = [
  {
    name: "name",
    label: "Your Name*",
    placeholder: "Your Name",
    type: "text",
  },
  {
    name: "email",
    label: "Your Email*",
    placeholder: "Your Email",
    type: "email",
  },
  {
    name: "message",
    label: "Message*",
    placeholder: "Write Message . .",
    type: "textarea",
  },
];

// Google Map URL for iframe (office: David Rd, Wellawatta)
export const googleMapUrl = SITE_CONTACT.mapEmbedUrl;
