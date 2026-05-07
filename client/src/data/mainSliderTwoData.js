// src/data/mainSliderTwoData.js

import buttonBg from "../assets/images/backgrounds/button-bg.png";
import element1 from "../assets/images/shapes/hero-1-4.png";
import element2 from "../assets/images/shapes/hero-shapr-1-2.png";
import element3 from "../assets/images/shapes/hero-1-2.png";
import element4 from "../assets/images/shapes/hero-shapr-1-2-a.png";
import element5 from "../assets/images/shapes/hero-1-1.png";

import mainSliderBg1 from "../assets/images/backgrounds/main-slider-bg-1-1.jpg";
import mainSliderBg2 from "../assets/images/backgrounds/main-slider-bg-1-2.jpg";
import mainSliderBg3 from "../assets/images/backgrounds/main-slider-bg-1-3.jpg";


export const sliderTowData = {
  tagline: "Explore Sri Lanka",
  title: "Discover Paradise",
  titleSpan: "In The Indian Ocean",
  buttonBg,

  sliderItems: [
    {
      id: 1,
      backgroundImage: mainSliderBg1,
      title: "Discover Ancient Temples & Sacred Sites",
      subtitle: "Experience spiritual Sri Lanka",
      text:
        "Visit magnificent ancient temples, sacred pilgrimage sites, and breathtaking monasteries nestled in the heart of Sri Lanka's lush landscapes.",
      imageElements: [element1, element2, element3, element4, element5],
    },
    {
      id: 2,
      backgroundImage: mainSliderBg2,
      title: "Pristine Beaches & Tropical Paradise",
      subtitle: "Relax on world-class beaches",
      text:
        "Enjoy golden sands, crystal-clear waters, and vibrant coral reefs. From Mirissa to Galle, your perfect beach escape awaits.",
      imageElements: [element1, element2, element3, element4, element5],
    },
    {
      id: 3,
      backgroundImage: mainSliderBg3,
      title: "Mountain Trekking & Tea Plantations",
      subtitle: "Adventure through misty highlands",
      text:
        "Trek through scenic tea gardens in Nuwara Eliya, climb Adam's Peak for sunrise, and experience Sri Lanka's verdant mountain ranges.",
      imageElements: [element1, element2, element3, element4, element5],
    },
  ],
};
