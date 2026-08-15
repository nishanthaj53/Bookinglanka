/**
 * Demo Sri Lanka hotels used by prisma/seed.js and maintenance scripts.
 * Keep in sync when you add/change seed properties.
 */

import { wikimediaFile } from "./destinationImages.js";

export const SEED_DEFAULT_ROOM_TEMPLATES = [
  {
    name: "Deluxe Room",
    description: "Comfortable room with modern interiors and private bathroom.",
    capacity: 2,
    pricePerNight: 110,
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    name: "Premium Suite",
    description: "Spacious suite with lounge area and premium amenities.",
    capacity: 3,
    pricePerNight: 170,
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    name: "Family Room",
    description: "Family-friendly room ideal for small groups and longer stays.",
    capacity: 4,
    pricePerNight: 210,
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    ],
  },
];

export const SEED_DEMO_HOTELS = [
  {
    id: "f1b9ab1a-0d01-4f24-a001-000000000101",
    name: "Galle Ocean Pearl",
    address: "Unawatuna Beach, Galle, Sri Lanka",
    latitude: 6.0095,
    longitude: 80.2483,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1400&q=80",
    ],
  },
  {
    id: "f1b9ab1a-0d01-4f24-a001-000000000102",
    name: "Galle Blue Horizon Resort",
    address: "Dewata, Galle, Sri Lanka",
    latitude: 6.0211,
    longitude: 80.2569,
    images: [
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1400&q=80",
    ],
  },
  {
    id: "f1b9ab1a-0d01-4f24-a001-000000000103",
    name: "Galle Palm Breeze Hotel",
    address: "Mahamodara, Galle, Sri Lanka",
    latitude: 6.0536,
    longitude: 80.2067,
    images: [
      "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1501117716987-c8e1ecb210cf?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1400&q=80",
    ],
  },
  {
    id: "f1b9ab1a-0d01-4f24-a001-000000000201",
    name: "Colombo Marine Front",
    address: "Marine Drive, Colombo, Sri Lanka",
    latitude: 6.8884,
    longitude: 79.8518,
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80",
    ],
  },
  {
    id: "f1b9ab1a-0d01-4f24-a001-000000000202",
    name: "Colombo City Central Hotel",
    address: "Fort, Colombo, Sri Lanka",
    latitude: 6.9344,
    longitude: 79.8428,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1400&q=80",
    ],
  },
  {
    id: "f1b9ab1a-0d01-4f24-a001-000000000203",
    name: "Colombo Skyline Bay",
    address: "Kollupitiya, Colombo, Sri Lanka",
    latitude: 6.9126,
    longitude: 79.8506,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1400&q=80",
    ],
  },
  {
    id: "f1b9ab1a-0d01-4f24-a001-000000000301",
    name: "Ella Mountain View Lodge",
    address: "Passara Road, Ella, Sri Lanka",
    latitude: 6.8667,
    longitude: 81.0466,
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1400&q=80",
    ],
  },
  {
    id: "f1b9ab1a-0d01-4f24-a001-000000000302",
    name: "Ella Peak Trail Hotel",
    address: "Little Adam's Peak Road, Ella, Sri Lanka",
    latitude: 6.8592,
    longitude: 81.0598,
    images: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1400&q=80",
    ],
  },
  {
    id: "f1b9ab1a-0d01-4f24-a001-000000000401",
    name: "Kandy River Heritage Hotel",
    address: "Mahaweli River Side, Kandy, Sri Lanka",
    latitude: 7.2906,
    longitude: 80.6337,
    images: [
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73f03?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1400&q=80",
    ],
  },
  {
    id: "f1b9ab1a-0d01-4f24-a001-000000000402",
    name: "Kandy Cultural Retreat",
    address: "Temple Road, Kandy, Sri Lanka",
    latitude: 7.2936,
    longitude: 80.6413,
    images: [
      "https://images.unsplash.com/photo-1576675784201-0e142b423952?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1535827841776-24afc1e255ac?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
    ],
  },
  {
    id: "f1b9ab1a-0d01-4f24-a001-000000000501",
    name: "Nallur Kovil View Hotel",
    address: "Point Pedro Road, Nallur, Jaffna, Sri Lanka",
    latitude: 9.6748,
    longitude: 80.0296,
    propertyType: "Heritage Guesthouse",
    overview:
      "A calm stay a short walk from Nallur Kandaswamy Kovil. Rooms look toward temple streets and palmyrah shade, with vegetarian-friendly dining and easy tuk-tuk access into Jaffna town.",
    highlights: ["Steps from Nallur Kovil", "Vegetarian kitchen", "Free Wi-Fi", "24-hour reception"],
    amenities: ["Temple-area location", "Courtyard seating", "Bicycle hire", "Airport / station pickup", "Laundry"],
    roomAmenities: ["Air conditioning", "Hot water", "Tea & coffee", "Mosquito netting", "Daily housekeeping"],
    images: [
      wikimediaFile("Nallur Kandaswamy Temple - Jaffna.jpg"),
      wikimediaFile("Nallur Kandaswamy Temple - Jaffna2.jpg"),
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1400&q=80",
    ],
    rooms: [
      {
        name: "Kovil Garden Double",
        description: "Quiet double room for two, a short stroll from Nallur Kandaswamy Kovil.",
        capacity: 2,
        pricePerNight: 95,
        images: [
          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
        ],
      },
      {
        name: "Nallur Family Room",
        description: "Larger room for families visiting the temple festival or a northern city break.",
        capacity: 4,
        pricePerNight: 155,
        images: [
          "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
        ],
      },
      {
        name: "Palmyrah Suite",
        description: "Sitting area, air-conditioning, and extra space after a day on the peninsula.",
        capacity: 3,
        pricePerNight: 185,
        images: [
          "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
        ],
      },
    ],
  },
  {
    id: "f1b9ab1a-0d01-4f24-a001-000000000502",
    name: "Jaffna Fort Heritage Hotel",
    address: "Fort, Jaffna, Sri Lanka",
    latitude: 9.662,
    longitude: 80.008,
    propertyType: "Boutique",
    overview:
      "A heritage-style stay beside the Dutch-era Jaffna Fort. High ceilings, a courtyard for northern seafood, and a walkable old-town location for markets and the lagoon edge.",
    highlights: ["Beside Jaffna Fort", "Courtyard dining", "Free Wi-Fi", "On-site restaurant"],
    amenities: ["Heritage courtyard", "Seafood restaurant", "Parking", "Concierge", "City tours"],
    roomAmenities: ["Air conditioning", "Smart TV", "Tea & coffee", "In-room safe", "Daily housekeeping"],
    images: [
      wikimediaFile("Jaffna Fort.jpg"),
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1400&q=80",
    ],
    rooms: [
      {
        name: "Rampart Double",
        description: "Classic double near the fort walls, suited to couples exploring old Jaffna.",
        capacity: 2,
        pricePerNight: 120,
        images: [
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
        ],
      },
      {
        name: "Courtyard Deluxe",
        description: "Looks onto the inner courtyard; convenient for dinner after a fort walk.",
        capacity: 3,
        pricePerNight: 165,
        images: [
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
        ],
      },
      {
        name: "Harbour Family Suite",
        description: "Family suite with sitting space, close to the lagoon and town markets.",
        capacity: 5,
        pricePerNight: 220,
        images: [
          "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
        ],
      },
    ],
  },
  {
    id: "f1b9ab1a-0d01-4f24-a001-000000000503",
    name: "Casuarina Palmyrah Lodge",
    address: "Casuarina Beach, Karainagar, Jaffna, Sri Lanka",
    latitude: 9.748,
    longitude: 79.882,
    propertyType: "Beach Lodge",
    overview:
      "A simple beach lodge on Karainagar facing Casuarina Beach — casuarina shade, lagoon boats, and palmyrah country. Ideal if you want sand and island day trips rather than a town-centre stay.",
    highlights: ["Casuarina Beach access", "Lagoon day trips", "Free Wi-Fi", "Seafood grill"],
    amenities: ["Beach access", "Outdoor seating", "Bicycle hire", "Boat trips", "Restaurant"],
    roomAmenities: ["Air conditioning", "Ceiling fan", "Hot water", "Tea & coffee", "Daily housekeeping"],
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1400&q=80",
    ],
    rooms: [
      {
        name: "Beach Casuarina Double",
        description: "Air-conditioned double a short walk from Casuarina Beach.",
        capacity: 2,
        pricePerNight: 110,
        images: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
        ],
      },
      {
        name: "Lagoon View Triple",
        description: "Extra bed space for three, handy after island-hopping on the lagoon.",
        capacity: 3,
        pricePerNight: 150,
        images: [
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
        ],
      },
      {
        name: "Palmyrah Beach Family",
        description: "Family room with space to unpack after a day at Casuarina and Kayts.",
        capacity: 4,
        pricePerNight: 195,
        images: [
          "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
        ],
      },
    ],
  },
];
