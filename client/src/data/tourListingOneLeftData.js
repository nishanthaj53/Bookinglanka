// ✅ FIX: use RELATIVE paths (no @/)
import image1 from "../assets/images/blog/listing-list-4-1.jpg";
import image2 from "../assets/images/blog/listing-list-4-2.jpg";
import image3 from "../assets/images/blog/listing-list-4-3.jpg";
import image4 from "../assets/images/blog/listing-list-4-4.jpg";



export const tourListingOneLeftData = {
  locations: [
    { label: "Colombo", value: "colombo" },
    { label: "Kandy", value: "kandy" },
    { label: "Ella", value: "ella" },
    { label: "Galle", value: "galle" },
    { label: "Mirissa", value: "mirissa" },
  ],

  activities: [
    { label: "Beach Holiday", value: "beach" },
    { label: "Cultural Tour", value: "cultural" },
    { label: "Adventure Trekking", value: "trekking" },
    { label: "Safari Tours", value: "safari" },
  ],

  dateRangePlaceholder: "Feb 5 - 5",
  travelerCount: 2,

  icons: {
    location: "icon icon-location",
    activity: "icon icon-travle",
    calendar: "icon icon-clock",
    group: "icon icon-group",
  },

  items: [
    {
      id: 1,
      image: image1,
      title: "Complete Sri Lanka Tour with Temple Visit & Elephant Sanctuary",
      link: "/tour-listing-details-2",
      price: "$899.00",
      rating: 5,
      reviews: 10,
      videoId: "0MuL8fd3pb8",
      discount: "",
      meta: [
        { id: 1, icon: "icon-pin1", title: "Colombo, Kandy, Ella" },
        { id: 2, icon: "icon-calendar", title: "7 Days, 6 Night" },
      ],
    },
    {
      id: 2,
      image: image2,
      title: "Tropical Beach & Wellness Retreat in Mirissa",
      link: "/tour-listing-details-2",
      price: "$649.00",
      rating: 4,
      reviews: 8,
      videoId: "GTn2EKD-cfg",
      discount: "30",
      meta: [
        { id: 1, icon: "icon-pin1", title: "Slingerland" },
        { id: 2, icon: "icon-calendar", title: "6 Days, 3 Night" },
      ],
    },
    {
      id: 3,
      image: image3,
      title: "All Inclusive Ultimate Circle Island Day with Lunch",
      link: "/tour-listing-details-2",
      price: "$59.00",
      rating: 5,
      reviews: 12,
      videoId: "0MuL8fd3pb8",
      discount: "",
      meta: [
        { id: 1, icon: "icon-pin1", title: "Slingerland" },
        { id: 2, icon: "icon-calendar", title: "6 Days, 3 Night" },
      ],
    },
    {
      id: 4,
      image: image4,
      title: "Molokini and Turtle Town Snorkeling Adventure Aboard",
      link: "/tour-listing-details-2",
      price: "$75.00",
      rating: 4,
      reviews: 15,
      videoId: "0MuL8fd3pb8",
      discount: "",
      meta: [
        { id: 1, icon: "icon-pin1", title: "Slingerland" },
        { id: 2, icon: "icon-calendar", title: "6 Days, 3 Night" },
      ],
    },
    {
      id: 5,
      image: image1,
      title: "All Inclusive Ultimate Circle Island Day with Lunch",
      link: "/tour-listing-details-2",
      price: "$59.00",
      rating: 5,
      reviews: 10,
      videoId: "0MuL8fd3pb8",
      discount: "",
      meta: [
        { id: 1, icon: "icon-pin1", title: "Slingerland" },
        { id: 2, icon: "icon-calendar", title: "6 Days, 3 Night" },
      ],
    },
    {
      id: 6,
      image: image2,
      title: "Molokini and Turtle Town Snorkeling Adventure Aboard",
      link: "/tour-listing-details-2",
      price: "$69.00",
      rating: 4,
      reviews: 8,
      videoId: "0MuL8fd3pb8",
      discount: "40",
      meta: [
        { id: 1, icon: "icon-pin1", title: "Slingerland" },
        { id: 2, icon: "icon-calendar", title: "6 Days, 3 Night" },
      ],
    },
  ],
};
