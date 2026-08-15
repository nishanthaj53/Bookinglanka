import { JAFFNA_GALLERY, DESTINATION_PLACE_IMAGES } from "./destinationImages.js";

function mapEmbed(query) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(`${query}, Sri Lanka`)}&z=12&output=embed`;
}

export const DEFAULT_DESTINATIONS = [
  {
    name: "Galle",
    slug: "galle",
    district: "Galle",
    town: "Galle",
    region: "Southern Province",
    bestFor: "History, fort, beaches",
    overview:
      "Galle is a historic port city on Sri Lanka’s southern coast, wrapped around the UNESCO-listed Galle Fort. Inside the ramparts you will find Dutch-era streets, boutique courtyards, lighthouses, and cafés that open to the Indian Ocean.\n\nJust beyond the walls, Unawatuna, Jungle Beach, and quiet fishing harbours make Galle an easy mix of heritage walking and sea days.",
    whyVisit:
      "Walk the fort ramparts at sunset for ocean and rooftop views.\nBrowse boutique streets, spice shops, and colonial churches inside the fort.\nSwim or snorkel at nearby Unawatuna and Jungle Beach.\nUse Galle as a base for southern coastal day trips.",
    mapEmbedUrl: mapEmbed("Galle Fort"),
    faqs: [
      {
        question: "Is Galle Fort walkable?",
        answer: "Yes. The old town inside the ramparts is best explored on foot. Wear comfortable shoes; cobbled lanes can be warm at midday.",
      },
      {
        question: "How far is Unawatuna from Galle?",
        answer: "Unawatuna is about 6 km east of Galle Fort, a short tuk-tuk or taxi ride.",
      },
    ],
  },
  {
    name: "Arugam Bay",
    slug: "arugam-bay",
    district: "Ampara",
    town: "Arugam Bay",
    region: "Eastern Province",
    bestFor: "Surfing, beach, wildlife",
    overview:
      "Arugam Bay is Sri Lanka’s best-known east-coast surf town: a long crescent beach, a laid-back main strip, and breaks that work for learners and experienced surfers.\n\nMornings are for the water; afternoons often turn to lagoon boat rides, Pottuvil Point, and wildlife around Kumana and nearby parks.",
    whyVisit:
      "Surf Main Point and nearby breaks with a relaxed beach-town base.\nEat fresh seafood along the bay after a session in the water.\nTake lagoon and safari trips for elephants, birds, and wild coastline.\nStay for sunsets that light up the east-coast sky.",
    mapEmbedUrl: mapEmbed("Arugam Bay"),
    faqs: [
      {
        question: "When is the surf season?",
        answer: "The main surf season on the east coast is roughly April to October, when swells are most consistent.",
      },
    ],
  },
  {
    name: "Ella",
    slug: "ella",
    district: "Badulla",
    town: "Ella",
    region: "Uva Province",
    bestFor: "Hiking, mountain views, rail journeys",
    overview:
      "Ella sits in the Uva hills among tea estates, cloud, and deep green valleys. The town is small, walkable, and famous as a stop on the Kandy–Badulla railway.\n\nLittle Adam’s Peak, Ella Rock, and the Nine Arch Bridge are the classic viewpoints — close enough that you can hike in the morning and still have time for a slow lunch overlooking the gap.",
    whyVisit:
      "Ride the scenic hill-country train and walk to Nine Arch Bridge.\nHike Little Adam’s Peak or Ella Rock for tea-estate views.\nCool off in a mountain-town climate after the coast.\nStay in lodges that look straight across the Ella Gap.",
    mapEmbedUrl: mapEmbed("Ella Sri Lanka"),
    faqs: [
      {
        question: "Do I need a guide for Ella Rock?",
        answer: "The trail is popular but can be confusing in mist. A local guide is helpful if you are not used to the path.",
      },
    ],
  },
  {
    name: "Colombo",
    slug: "colombo",
    district: "Colombo",
    town: "Colombo",
    region: "Western Province",
    bestFor: "City breaks, shopping, food",
    overview:
      "Colombo is Sri Lanka’s commercial capital: a working harbour city with Galle Face Green, Fort’s colonial grid, Pettah markets, and a fast-growing dining scene.\n\nIt is the natural first or last stop on most trips — close to the airport, with hotels along the sea and in the city centre.",
    whyVisit:
      "Walk Galle Face at dusk and try street food along the green.\nShop in Independence Arcade, Dutch Hospital, and modern malls.\nEat across Sri Lankan, Tamil, and international kitchens.\nConnect easily to trains, coaches, and domestic flights.",
    mapEmbedUrl: mapEmbed("Colombo Fort"),
    faqs: [
      {
        question: "How far is the airport from Colombo?",
        answer: "Bandaranaike International Airport (CMB) is about 30–45 minutes from central Colombo, depending on traffic.",
      },
    ],
  },
  {
    name: "Sigiriya",
    slug: "sigiriya",
    district: "Matale",
    town: "Sigiriya",
    region: "Central Province",
    bestFor: "Ancient heritage, rock fortress",
    overview:
      "Sigiriya is the 5th-century rock fortress of King Kashyapa — frescoes, mirror wall, lion’s-paw gateway, and a summit with views across the Cultural Triangle.\n\nPidurangala, Dambulla cave temples, and safari parks sit within a short drive, so one or two nights here cover both archaeology and countryside.",
    whyVisit:
      "Climb Sigiriya Rock for frescoes, gardens, and summit views.\nWatch sunrise from Pidurangala with fewer crowds.\nVisit Dambulla’s cave temples on the same circuit.\nAdd a village or safari day in the Cultural Triangle.",
    mapEmbedUrl: mapEmbed("Sigiriya Rock"),
    faqs: [
      {
        question: "How long does the Sigiriya climb take?",
        answer: "Plan 2–3 hours including the gardens and summit. Start early to avoid heat and queues.",
      },
    ],
  },
  {
    name: "Kandy",
    slug: "kandy",
    district: "Kandy",
    town: "Kandy",
    region: "Central Province",
    bestFor: "Culture, temples, lake",
    overview:
      "Kandy is the hill-country cultural capital, built around a lake and the sacred Temple of the Tooth (Sri Dalada Maligawa). Evening puja, Kandyan dance, and the Perahera season give the city a living religious rhythm.\n\nPeradeniya Botanical Gardens, the Mahaweli valley, and the start of the tea-train route make Kandy a natural hub between Colombo and the highlands.",
    whyVisit:
      "Visit the Temple of the Tooth and walk the lake loop.\nWatch Kandyan dance and browse the city market.\nSpend a morning at Peradeniya Botanical Gardens.\nBoard the hill-country train toward Nuwara Eliya or Ella.",
    mapEmbedUrl: mapEmbed("Temple of the Tooth Kandy"),
    faqs: [
      {
        question: "How should I dress at the Temple of the Tooth?",
        answer: "Cover shoulders and knees, remove shoes, and choose modest, light clothing. White is traditional but not required.",
      },
    ],
  },
  {
    name: "Nuwara Eliya",
    slug: "nuwara-eliya",
    district: "Nuwara Eliya",
    town: "Nuwara Eliya",
    region: "Central Province",
    bestFor: "Tea country, cool climate",
    overview:
      "Nuwara Eliya, often called Little England, sits above 1,800 m among tea estates, vegetable gardens, and cool mist. Colonial bungalows, a racecourse, and Gregory Lake sit beside working tea factories.\n\nIt is the place for jumper weather, factory tours, and drives toward Horton Plains or nearby waterfalls.",
    whyVisit:
      "Tour a working tea factory and walk estate paths.\nEnjoy a cool climate after the low-country heat.\nVisit Gregory Lake, Victoria Park, and nearby waterfalls.\nDay-trip to Horton Plains and World’s End when weather allows.",
    mapEmbedUrl: mapEmbed("Nuwara Eliya"),
    faqs: [
      {
        question: "Will I need warm clothes?",
        answer: "Yes. Evenings are cool year-round. Pack a light jacket, especially from December to February.",
      },
    ],
  },
  {
    name: "Jaffna",
    slug: "jaffna",
    district: "Jaffna",
    town: "Jaffna",
    region: "Northern Province",
    bestFor: "Tamil heritage, temples, islands",
    overview:
      "Jaffna is the cultural heart of Sri Lanka’s north — Tamil language, Hindu kovils, palmyrah groves, and a kitchen known for crab, palmyrah treacle, and spicy vegetarian fare. The city’s landmark is Nallur Kandaswamy Kovil, the great Murugan temple whose gopuram and festival chariot roads define the old royal capital of Nallur.\n\nFrom town you can reach Jaffna Fort, the lagoon islands of Kayts and Karainagar, Casuarina Beach, and the sacred island of Nainativu. Stays here feel different from the south: quieter streets, temple bells, and seafood grilled the northern way.",
    whyVisit:
      "Stand before Nallur Kandaswamy Kovil and, in season, watch the chariot festival.\nTaste Jaffna crab, odiyal kool, and palmyrah sweets in local restaurants.\nWalk the Dutch-era Jaffna Fort and the old town around it.\nCross the lagoon to Casuarina Beach, Kayts, and Nainativu (Nagadeepa).\nUse Jaffna as a base for northern islands and coastal day trips.",
    mapEmbedUrl: mapEmbed("Nallur Kandaswamy Kovil Jaffna"),
    coverImageUrl: DESTINATION_PLACE_IMAGES.jaffna,
    cardImageUrl: DESTINATION_PLACE_IMAGES.jaffna,
    galleryImages: JAFFNA_GALLERY,
    faqs: [
      {
        question: "What is Nallur Kovil?",
        answer:
          "Nallur Kandaswamy Kovil is Jaffna’s principal Hindu temple, dedicated to Murugan. Modest dress is required. The annual festival (usually July–August) is the peninsula’s biggest cultural event — book rooms early.",
      },
      {
        question: "How do I get to Jaffna?",
        answer:
          "Trains and coaches run from Colombo. By road it is a full-day drive. Small domestic flights may operate to Jaffna depending on the season.",
      },
      {
        question: "What else is near Jaffna town?",
        answer:
          "Jaffna Fort, Casuarina Beach (Karainagar), the islands across the lagoon, and Nainativu temple island are the usual day trips from a town-centre stay.",
      },
    ],
  },
];

export { DESTINATION_PLACE_IMAGES };
