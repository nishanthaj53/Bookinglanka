import corkiImage from "../assets/images/shapes/corki.png";
import listImage from "../assets/images/shapes/list-4-1.png";
import itemImage1 from "../assets/images/resources/item-1-1.jpg";
import itemImage2 from "../assets/images/resources/item-1-2.jpg";
import itemImage3 from "../assets/images/resources/item-1-3.jpg";
import itemImage4 from "../assets/images/resources/item-1-4.jpg";
import itemImage5 from "../assets/images/resources/item-1-5.jpg";
import itemImage6 from "../assets/images/resources/item-1-6.jpg";

export const tourListingPageData = {
  sectionTitle: "New Listings in Our Tour",
  sectionTagline: "Popular Tours List",

  filterOptions: {
    locations: [
      "Locations",
      "Colombo",
      "Kandy",
      "Ella",
      "Galle",
      "Mirissa",
      "Sigiriya",
      "Arugambe",
      "Nuwaraeliya",
    ],

    hotelTypes: [
      "Hotel Type",
      "Budget Hotels",
      "Mid-Range Hotels",
      "Luxury Resorts",
      "Beach Resorts",
      "Eco Lodges",
    ],

    tourBudgets: [
      "Tour Budget",
      "$500",
      "$1000",
      "$1500",
      "$2500",
      "$4000",
      "$6000",
    ],

    activities: ["Activity Type", "Beach", "Trekking", "Cultural", "Wildlife", "Adventure"],

    hotelTypes2: [
      "Hotel Type",
      "Budget Hotels",
      "Mid-Range Hotels",
      "Luxury Resorts",
      "Beach Resorts",
      "Eco Lodges",
    ],

    reviews: ["Reviews", "Excellent", "Very Good"],

    prices: [
      "Filter Price",
      "$500",
      "$1000",
      "$1500",
      "$2500",
      "$4000",
      "$6000",
    ],
  },

  tours: [
    {
      image: itemImage1,
      title: "Complete Sri Lanka Island Tour with Elephant Sanctuary Visit",
      location: "Colombo, Kandy, Ella",
      duration: "7 Days, 6 Night",
      price: "$899.00",
      discount: "-25% Off",
      videoId: "0MuL8fd3pb8",
    },
    {
      image: itemImage2,
      title: "Tropical Beach & Wellness Getaway in Mirissa",
      location: "Mirissa",
      duration: "5 Days, 4 Night",
      price: "$649.00",
      discount: "-30% Off",
      videoId: "0MuL8fd3pb8",
      featured: true,
    },
    {
      image: itemImage3,
      title: "Ancient Temples & Cultural Heritage Tour",
      location: "Kandy, Sigiriya",
      duration: "6 Days, 5 Night",
      price: "$749.00",
      discount: "-20% Off",
      videoId: "0MuL8fd3pb8",
    },
    {
      image: itemImage4,
      title: "Yala National Park Safari & Wildlife Adventure",
      location: "Yala",
      duration: "3 Days, 2 Night",
      price: "$599.00",
      discount: "-25% Off",
      videoId: "0MuL8fd3pb8",
      featured: true,
    },
    {
      image: itemImage5,
      title: "Tea Plantations & Scenic Mountain Trail Tour",
      location: "Nuwara Eliya, Ella",
      duration: "4 Days, 3 Night",
      price: "$549.00",
      videoId: "0MuL8fd3pb8",
      featured: true,
    },
    {
      image: itemImage6,
      title: "Galle Fort & South Coast Historical Journey",
      location: "Galle, Unawatuna",
      duration: "3 Days, 2 Night",
      price: "$449.00",
      discount: "-20% Off",
      videoId: "0MuL8fd3pb8",
    },
  ],

  images: {
    corkiImage,
    listImage,
  },
};
