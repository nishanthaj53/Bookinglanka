// src/data/mainSliderThreeData.js

import shapr1 from "../assets/images/shapes/hero-shapr-1-1.png";
import shapr2 from "../assets/images/shapes/hero-shapr-1-2.png";
import shapr3 from "../assets/images/shapes/hero-shapr-1-3.png";
import shapr4 from "../assets/images/shapes/hero-shapr-1-2-a.png";
import elementTwo from "../assets/images/shapes/why-choose-tree.png";

import thumbImage from "../assets/images/resources/landing-hero-sri-lanka-collage.png";
import buttonBg from "../assets/images/backgrounds/button-bg.png";

export const mainSliderData = {
  buttonBg,
  elementTwo,
  sliderItems: {
    id: 1,
    tagLine: "Welcome to Booking Lanka",
    title: "Your Perfect",
    titleSpan: "Sri Lanka Vacation",
    subtitle: "Seamless booking for unforgettable island experiences",
    text: "Discover and book the best hotels, tours, and experiences across Sri Lanka. From cultural heritage to beach paradises, we make your journey extraordinary.",
    thumbImage,
    videoId: "0MuL8fd3pb8",
    buttonLink: "/about",
  },
  imageElements: [
    { id: 1, image: shapr1 },
    { id: 2, image: shapr2 },
    { id: 3, image: shapr3 },
    { id: 4, image: shapr4 },
  ],
};
