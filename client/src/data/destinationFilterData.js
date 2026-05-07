import image1 from "../assets/images/destination/destination-1-1.jpg";
import image2 from "../assets/images/destination/destination-1-2.jpg";
import image3 from "../assets/images/destination/destination-1-3.jpg";
import image4 from "../assets/images/destination/destination-1-4.jpg";



import plan from "../assets/images/shapes/plan.png";
import monjil from "../assets/images/shapes/monjil.png";

export const destinationFilterData = {
  subtitle: "Explore Sri Lanka",
  title: "Popular",
  titleSpan: "Destinations",
  description:
    "Sri Lanka offers a rare blend of pristine beaches, misty mountain landscapes, ancient temples, vibrant towns, and charming villages all within a compact island paradise.",
  items: {
    "Beach Destinations": [
      { id: 1, image: image1, title: "Mirissa", link: "/destinationGalle" },
      { id: 2, image: image2, title: "Galle", link: "/destinationGalle" },
      { id: 3, image: image3, title: "Arugambe", link: "/destinationArugampe" },
      { id: 4, image: image4, title: "Unawatuna", link: "/destinationGalle" },
    ],
    "Cultural Sites": [
      { id: 5, image: image1, title: "Kandy", link: "/destinationkandy" },
      { id: 6, image: image2, title: "Sigiriya", link: "/destinationSigiriya" },
    ],
  },
  plan,
  monjil,
};
