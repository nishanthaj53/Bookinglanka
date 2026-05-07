import testiImage1 from "../assets/images/resources/about-testimonials-sigiriya.png";
import aboutAuthorImage from "../assets/images/resources/about-author-1-1.jpg";
import shapeImage1 from "../assets/images/shapes/testi-1-3.png";
import shapeImage2 from "../assets/images/resources/testi-1-2.png";
import brand1 from "../assets/images/brand/brand-1-1.png";
import brandHover1 from "../assets/images/brand/brand-hover-1-1.png";

export const aboutTestimonialsData = {
  sectionTitle: "What Our Travelers Say",
  sectionTagline: "Client Testimonials",
  testiThumb: testiImage1,

  testimonials: [
    {
      image: aboutAuthorImage,
      text: "Booking Lanka made my Sri Lanka trip absolutely seamless! From Sigiriya to the beaches of Mirissa, everything was perfectly arranged. The customer service was exceptional.",
      authorName: "Sarah Johnson",
      position: "Traveler from USA",
    },
    {
      image: aboutAuthorImage,
      text: "I was amazed by the variety of experiences available. From tea plantations in Kandy to wildlife safaris in Yala, Booking Lanka has something for everyone. Highly recommended!",
      authorName: "Michael Chen",
      position: "Adventurer from Singapore",
    },
    {
      image: aboutAuthorImage,
      text: "The hotel selections are fantastic and the prices are unbeatable. My family had the most memorable vacation thanks to Booking Lanka's excellent service and attention to detail.",
      authorName: "Emma Wilson",
      position: "Family Traveler from Australia",
    },
  ],

  shapeImages: [shapeImage1, shapeImage2],

  brands: [
    { image: brand1, hoverImage: brandHover1 },
    { image: brand1, hoverImage: brandHover1 },
    { image: brand1, hoverImage: brandHover1 },
    { image: brand1, hoverImage: brandHover1 },
    { image: brand1, hoverImage: brandHover1 },
    { image: brand1, hoverImage: brandHover1 },
  ],
};
