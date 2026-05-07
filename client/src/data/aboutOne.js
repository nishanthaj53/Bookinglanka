import { SITE_CONTACT } from "./siteContact";
import aboutImg1 from "../assets/images/about/booking-lanka-about-back.png";
import aboutImg2 from "../assets/images/about/booking-lanka-about-front.png";
import aboutImg3 from "../assets/images/shapes/about-1-3.png";
import aboutShape1 from "../assets/images/shapes/about-1-1.png";
import aboutShape2 from "../assets/images/shapes/about-1-2.png";

export const aboutOneData = {
  title: "Discover Sri Lanka - Your Gateway to Paradise",
  subtitle: "About Booking Lanka",
  description:
    "We are dedicated to showcasing the best of Sri Lanka, from pristine beaches and ancient Buddhist temples to lush tea plantations and exotic wildlife. Our mission is to make planning your dream Sri Lankan vacation effortless and unforgettable.",

  features: [
    {
      icon: "icon-check-star",
      text: "Easy & Quick Booking",
    },
    {
      icon: "icon-check-star",
      text: "Best Hotels & Tours",
    },
  ],

  mission: {
    icon: "icon-misstion",
    title: "Our Mission",
    text: "We're committed to providing authentic experiences that showcase Sri Lanka's natural beauty, rich culture, and warm hospitality to travelers worldwide.",
  },

  button: {
    text: "Explore Destinations",
    link: "/about",
    callIcon: "icon-telephone",
    callText: "Call Us Now",
    phone: SITE_CONTACT.phone,
    phoneTel: SITE_CONTACT.phoneTel,
  },

  images: {
    mainImage: aboutImg1,
    smallImage: aboutImg2,
    popupImage: aboutImg3,
    shape1: aboutShape1,
    shape2: aboutShape2,
  },
};
