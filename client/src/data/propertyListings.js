export const PROPERTY_TYPES = [
  { value: "land", label: "Land for sale" },
  { value: "house", label: "House for sale" },
  { value: "apartment", label: "Apartment for sale" },
];

/** Wide 1920×460 crop for the property page banner. */
function banner(photoId) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1920&h=460&q=80`;
}

function card(photoId) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1400&q=80`;
}

export const PROPERTY_TYPE_BANNERS = {
  "": banner("photo-1560518883-ce09059eeffa"),
  land: banner("photo-1500382017468-9049fed747ef"),
  house: banner("photo-1564013799919-ab600027ffc6"),
  apartment: banner("photo-1545324418-cc1a3fa10c00"),
};

export const PROPERTY_LISTINGS = [
  {
    id: "land-jaffna-palmyrah",
    type: "land",
    name: "Palmyrah Grove Plot, Jaffna",
    city: "Jaffna",
    address: "Point Pedro Road, Jaffna, Sri Lanka",
    size: "40 perches",
    price: 12500000,
    image: card("photo-1500382017468-9049fed747ef"),
    bannerImage: banner("photo-1500382017468-9049fed747ef"),
    description:
      "Open agricultural land with palmyrah shade on the Jaffna peninsula. Road access and a short drive to Nallur and town.",
  },
  {
    id: "land-galle-unawatuna",
    type: "land",
    name: "Coastal Plot near Unawatuna",
    city: "Galle",
    address: "Unawatuna, Galle, Sri Lanka",
    size: "22 perches",
    price: 28000000,
    image: card("photo-1464226184884-fa280b87c399"),
    bannerImage: banner("photo-1507525428034-b723cf961d3e"),
    description:
      "Elevated residential plot a few minutes from Unawatuna beach, suitable for a holiday house or small villa.",
  },
  {
    id: "land-kandy-hillside",
    type: "land",
    name: "Hillside Tea-View Land, Kandy",
    city: "Kandy",
    address: "Peradeniya Road, Kandy, Sri Lanka",
    size: "35 perches",
    price: 18500000,
    image: card("photo-1625246333195-78d9c38ad449"),
    bannerImage: banner("photo-1464822759023-fed622ff2c3b"),
    description:
      "Sloping highland plot with valley views, close to Peradeniya. Quiet setting for a family home.",
  },
  {
    id: "land-negombo-lagoon",
    type: "land",
    name: "Lagoon-Side Land, Negombo",
    city: "Negombo",
    address: "Lewis Place side, Negombo, Sri Lanka",
    size: "18 perches",
    price: 22000000,
    image: card("photo-1472214103451-9374bd1c798e"),
    bannerImage: banner("photo-1439066615861-d1af74d74000"),
    description:
      "Buildable plot near Negombo lagoon and the airport road. Easy access to Colombo and the west coast.",
  },
  {
    id: "house-colombo-06",
    type: "house",
    name: "Family House, Colombo 06",
    city: "Colombo",
    address: "Galle Road, Colombo 06, Sri Lanka",
    size: "4 bed · 3 bath",
    price: 95000000,
    image: card("photo-1564013799919-ab600027ffc6"),
    bannerImage: banner("photo-1564013799919-ab600027ffc6"),
    description:
      "Two-storey family house in Wellawatte / Colombo 06 with parking and a small garden. Close to shops and the sea.",
  },
  {
    id: "house-jaffna-nallur",
    type: "house",
    name: "Courtyard House, Nallur",
    city: "Jaffna",
    address: "Nallur, Jaffna, Sri Lanka",
    size: "3 bed · 2 bath",
    price: 42000000,
    image: card("photo-1600596542815-ffad4c1539a9"),
    bannerImage: banner("photo-1600596542815-ffad4c1539a9"),
    description:
      "Single-storey house with a central courtyard, a short walk from Nallur Kandaswamy Kovil.",
  },
  {
    id: "house-kandy-lake",
    type: "house",
    name: "Lake-View House, Kandy",
    city: "Kandy",
    address: "Sangaraja Mawatha, Kandy, Sri Lanka",
    size: "3 bed · 2 bath",
    price: 68000000,
    image: card("photo-1600585154340-be6161a56a0c"),
    bannerImage: banner("photo-1600585154340-be6161a56a0c"),
    description:
      "Hill-country house above Kandy Lake with a verandah and garden. Cool climate and town access.",
  },
  {
    id: "house-galle-fort",
    type: "house",
    name: "Garden Villa, Galle",
    city: "Galle",
    address: "Mahamodara, Galle, Sri Lanka",
    size: "3 bed · 3 bath",
    price: 72000000,
    image: card("photo-1570129477492-45c003edd2be"),
    bannerImage: banner("photo-1570129477492-45c003edd2be"),
    description:
      "Tropical villa with indoor-outdoor living, minutes from Galle Fort and the southern beaches.",
  },
  {
    id: "apt-colombo-03",
    type: "apartment",
    name: "Sea-Facing Apartment, Colombo 03",
    city: "Colombo",
    address: "Marine Drive, Colombo 03, Sri Lanka",
    size: "2 bed · 2 bath",
    price: 58000000,
    image: card("photo-1545324418-cc1a3fa10c00"),
    bannerImage: banner("photo-1545324418-cc1a3fa10c00"),
    description:
      "Modern apartment near Galle Face with city and ocean outlooks. Lift, parking, and 24-hour security.",
  },
  {
    id: "apt-wellawatte",
    type: "apartment",
    name: "Wellawatte High-Rise Apartment",
    city: "Colombo",
    address: "Galle Road, Wellawatte, Colombo, Sri Lanka",
    size: "3 bed · 2 bath",
    price: 64000000,
    image: card("photo-1486406146926-c627a92ad1ab"),
    bannerImage: banner("photo-1486406146926-c627a92ad1ab"),
    description:
      "Spacious apartment in a Wellawatte tower, close to shops, temples, and the coastal train.",
  },
  {
    id: "apt-kandy-city",
    type: "apartment",
    name: "City Apartment, Kandy",
    city: "Kandy",
    address: "Peradeniya Road, Kandy, Sri Lanka",
    size: "2 bed · 1 bath",
    price: 32000000,
    image: card("photo-1560448204-e02f11c3d0e2"),
    bannerImage: banner("photo-1460317442991-0ec209397118"),
    description:
      "Compact apartment for a hill-country base, with parking and easy access to the lake and temple.",
  },
  {
    id: "apt-galle-harbour",
    type: "apartment",
    name: "Harbour View Apartment, Galle",
    city: "Galle",
    address: "Closenberg Road, Galle, Sri Lanka",
    size: "2 bed · 2 bath",
    price: 39000000,
    image: card("photo-1502672260266-1c1ef2d93688"),
    bannerImage: banner("photo-1502672260266-1c1ef2d93688"),
    description:
      "Low-rise apartment near Galle harbour with a balcony and short tuk-tuk ride to the Fort.",
  },
];

export function formatPropertyPrice(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "Price on request";
  return `LKR ${n.toLocaleString("en-LK")}`;
}

export function getPropertyById(id) {
  return PROPERTY_LISTINGS.find((item) => item.id === id) || null;
}

export function filterProperties({ type = "", city = "", minPrice = "", maxPrice = "", q = "" } = {}) {
  const typeNorm = String(type || "").toLowerCase().trim();
  const cityNorm = String(city || "").toLowerCase().trim();
  const query = String(q || "").toLowerCase().trim();
  const min = minPrice === "" || minPrice == null ? null : Number(minPrice);
  const max = maxPrice === "" || maxPrice == null ? null : Number(maxPrice);

  return PROPERTY_LISTINGS.filter((item) => {
    if (typeNorm && typeNorm !== "all" && item.type !== typeNorm) return false;
    if (cityNorm && !String(item.city).toLowerCase().includes(cityNorm)) return false;
    if (Number.isFinite(min) && item.price < min) return false;
    if (Number.isFinite(max) && item.price > max) return false;
    if (query) {
      const hay = `${item.name} ${item.address} ${item.city} ${item.type}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });
}
