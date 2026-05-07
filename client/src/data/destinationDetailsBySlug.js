/**
 * Per-destination content and images. Each location has its own text and images
 * so Kandy, Galle, Ella, Arugam Bay, and Sigiriya show location-specific culture and photos.
 *
 * To use your own photos per location, add images under:
 *   assets/images/destinations/kandy/   (e.g. slider-1.jpg, thumb-1.jpg)
 *   assets/images/destinations/galle/
 *   assets/images/destinations/ella/
 *   assets/images/destinations/arugampe/
 *   assets/images/destinations/sigiriya/
 * and replace the imports below for that destination.
 */

// Slider backgrounds (used for Kandy, Ella, Sigiriya variants)
import sliderImage1 from "../assets/images/backgrounds/destination-slider-1-1.jpg";
import sliderImage2 from "../assets/images/backgrounds/destination-slider-1-2.jpg";
import sliderImage3 from "../assets/images/backgrounds/destination-slider-1-3.jpg";
import sliderImage4 from "../assets/images/backgrounds/destination-slider-1-4.jpg";
// Destination gallery images (content thumbs)
import img1 from "../assets/images/destination/destination-d-s-1.jpg";
import img2 from "../assets/images/destination/destination-d-s-2.jpg";
// Alternative set (used for Galle, Arugam Bay so they have a different look)
import dest1 from "../assets/images/destination/destination-1-1.jpg";
import dest2 from "../assets/images/destination/destination-1-2.jpg";
import dest3 from "../assets/images/destination/destination-1-3.jpg";
import dest4 from "../assets/images/destination/destination-1-4.jpg";

// Kandy – cultural/hill (slider set 1 + content set 1)
const kandySliderImages = [sliderImage1, sliderImage2, sliderImage3, sliderImage4];
const kandyImages = [img1, img2];

// Galle – fort/beach (different slider set so it’s not the same as Kandy)
const galleSliderImages = [dest1, dest2, dest3, dest4];
const galleImages = [img1, img2];

// Ella – hills (reordered slider + content for variety)
const ellaSliderImages = [sliderImage2, sliderImage3, sliderImage4, sliderImage1];
const ellaImages = [img2, img1];

// Arugam Bay – surf/beach (alternative set + reordered content)
const arugampeSliderImages = [dest2, dest3, dest4, dest1];
const arugampeImages = [img2, img1];

// Sigiriya – rock/cultural (reordered slider)
const sigiriyaSliderImages = [sliderImage3, sliderImage4, sliderImage1, sliderImage2];
const sigiriyaImages = [img1, img2];

const destinationDetailsBySlug = {
  kandy: {
    title: "About Kandy",
    titleTwo: "Why Visit Kandy",
    overview:
      "Kandy is the cultural heart of Sri Lanka and a UNESCO World Heritage Site. Nestled among hills and the Mahaweli River, it is home to the sacred Temple of the Tooth Relic (Sri Dalada Maligawa), the Royal Botanical Gardens at Peradeniya, and vibrant Kandyan dance and crafts. The city offers a blend of spirituality, history, and scenic beauty.",
    topDestinations:
      "Must-see spots include the Temple of the Tooth, Peradeniya Botanical Gardens, Kandy Lake, the Cultural Triangle, and nearby tea estates. Kandy is also the gateway to the central highlands and hill country. With excellent hotels and cultural experiences, it remains one of Sri Lanka's most visited destinations.",
    sliderImages: kandySliderImages,
    images: kandyImages,
    destinationInfo: [
      { label: "Region", value: "Central Province" },
      { label: "Elevation", value: "~500 m" },
      { label: "Best for", value: "Culture, temples, nature" },
    ],
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.923909350393!2d80.6337!3d7.2936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae366266498acd3%3A0x411a3818a1e03c35!2sKandy%2C%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1769682000000!5m2!1sen!2slk",
    faqs: [
      {
        question: "What is the best time to visit Kandy?",
        answer:
          "Kandy is pleasant year-round. December to April is drier. The Esala Perahera (July/August) is a major festival—book early if you plan to visit then.",
      },
      {
        question: "How do I dress for the Temple of the Tooth?",
        answer:
          "Shoulders and knees must be covered. Remove shoes before entering. White or light, modest clothing is recommended.",
      },
      {
        question: "What else is there to do in Kandy?",
        answer:
          "Visit Peradeniya Botanical Gardens, watch Kandyan dance shows, explore the market, and take day trips to tea estates or Nuwara Eliya.",
      },
      {
        question: "Is Kandy safe for tourists?",
        answer:
          "Yes. Kandy is a major tourist city. Use normal precautions with belongings and transport.",
      },
    ],
  },

  galle: {
    title: "About Galle",
    titleTwo: "Why Visit Galle",
    overview:
      "Galle is a historic port city on the southwest coast and a UNESCO World Heritage Site. The Galle Fort—built by the Portuguese and expanded by the Dutch—is a maze of cobbled streets, colonial buildings, cafes, and boutiques. The city blends history, beaches, and a relaxed coastal vibe.",
    topDestinations:
      "Explore the Galle Fort, the lighthouse, Dutch Reformed Church, and the ramparts with ocean views. Nearby are Unawatuna and Jungle beaches. Galle is known for jewelry, antiques, and a thriving arts and dining scene. Ideal for history lovers and beach-goers alike.",
    sliderImages: galleSliderImages,
    images: galleImages,
    destinationInfo: [
      { label: "Region", value: "Southern Province" },
      { label: "Heritage", value: "UNESCO World Heritage Site" },
      { label: "Best for", value: "History, fort, beaches" },
    ],
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.063789!2d80.2172!3d6.0531!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae173a6b9a0631d%3A0x2fec8070a1b0c842!2sGalle%20Fort%2C%20Galle%2C%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1769682100000!5m2!1sen!2slk",
    faqs: [
      {
        question: "What is the best time to visit Galle?",
        answer:
          "December to March is ideal—dry and sunny. The southwest monsoon (May–September) can bring rain but the fort is still enjoyable.",
      },
      {
        question: "How much time do I need in Galle?",
        answer:
          "One full day for the fort and town is enough; add more for beaches and day trips to nearby areas.",
      },
      {
        question: "What is there to do inside Galle Fort?",
        answer:
          "Walk the ramparts, visit museums and churches, shop for gems and crafts, and dine at rooftop cafes with sea views.",
      },
      {
        question: "Is Galle good for families?",
        answer:
          "Yes. The fort is walkable and safe. Beaches like Unawatuna are nearby and family-friendly.",
      },
    ],
  },

  ella: {
    title: "About Ella",
    titleTwo: "Why Visit Ella",
    overview:
      "Ella is a small mountain town in the central highlands, famous for tea country views, hiking, and a laid-back backpacker vibe. Highlights include Little Adam's Peak, Ella Rock, the Nine Arch Bridge, and stunning viewpoints over valleys and tea plantations.",
    topDestinations:
      "Hike Little Adam's Peak and Ella Rock, visit the Nine Arch Bridge, and enjoy train rides through the hills. Ella has cafes, guesthouses, and yoga retreats. It's a base for exploring Ravana Falls, Lipton's Seat, and tea factories. Perfect for nature and adventure lovers.",
    sliderImages: ellaSliderImages,
    images: ellaImages,
    destinationInfo: [
      { label: "Region", value: "Uva Province" },
      { label: "Elevation", value: "~1,041 m" },
      { label: "Best for", value: "Hiking, trains, scenery" },
    ],
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.5!2d81.0463!3d6.8667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae464c58d2d763f%3A0x69d3c767a0f26c8!2sElla%2C%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1769682200000!5m2!1sen!2slk",
    faqs: [
      {
        question: "What is the best time to visit Ella?",
        answer:
          "January to April and July to September are good. Avoid heavy monsoon (October–November in this region) if you want clear views.",
      },
      {
        question: "How difficult are the hikes in Ella?",
        answer:
          "Little Adam's Peak is relatively easy. Ella Rock is moderate. Both offer rewarding views; wear proper shoes and carry water.",
      },
      {
        question: "Is the train to Ella worth it?",
        answer:
          "Yes. The Kandy–Ella (or Nuwara Eliya–Ella) train is one of the world's scenic rail journeys. Book in advance in peak season.",
      },
      {
        question: "How many days in Ella?",
        answer:
          "Two to three days is enough for main hikes and the Nine Arch Bridge; add more for relaxation or day trips.",
      },
    ],
  },

  arugampe: {
    title: "About Arugam Bay",
    titleTwo: "Why Visit Arugam Bay",
    overview:
      "Arugam Bay (Arugambe) on the east coast is one of Sri Lanka's top surf destinations. It has a long right-hand point break, a relaxed beach-town vibe, and access to Kumana and Yala for wildlife. The area is less developed than the south, with a mix of surf lodges, cafes, and nature.",
    topDestinations:
      "Surf at Main Point, Whiskey Point, and other breaks. Visit Kumana National Park, Pottuvil Lagoon, and nearby temples. The season runs roughly May to September when the east coast is dry. Ideal for surfers, beach lovers, and those seeking a quieter coast.",
    sliderImages: arugampeSliderImages,
    images: arugampeImages,
    destinationInfo: [
      { label: "Region", value: "Eastern Province" },
      { label: "Season", value: "May–September (east coast dry)" },
      { label: "Best for", value: "Surfing, beach, wildlife" },
    ],
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.2!2d81.8389!3d6.8389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae5f3e583a7f3a7%3A0x1b2c3d4e5f6a7b8c!2sArugam%20Bay%2C%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1769682300000!5m2!1sen!2slk",
    faqs: [
      {
        question: "When is the best time for Arugam Bay?",
        answer:
          "May to September is peak—good surf and dry weather. The rest of the year can be wet on the east coast.",
      },
      {
        question: "Do I need to surf to enjoy Arugam Bay?",
        answer:
          "No. You can relax on the beach, visit Kumana or Yala, go lagoon tours, or enjoy the laid-back town and cafes.",
      },
      {
        question: "How do I get to Arugam Bay?",
        answer:
          "By road from Colombo (via Ratnapura or south coast) or by air to Batticaloa then road. Journey can take several hours.",
      },
      {
        question: "Is it safe to swim and surf?",
        answer:
          "Swim in designated areas and respect local advice. Surf conditions vary—beginners should take lessons and stick to suitable breaks.",
      },
    ],
  },

  sigiriya: {
    title: "About Sigiriya",
    titleTwo: "Why Visit Sigiriya",
    overview:
      "Sigiriya is an ancient rock fortress and UNESCO World Heritage Site rising from the central plains. The 5th-century citadel features frescoes, mirror wall, and the Lion's Gate. The summit offers ruins and panoramic views. It is one of Sri Lanka's most iconic landmarks.",
    topDestinations:
      "Climb Sigiriya Rock for history and views, and visit the museum at the base. Combine with Dambulla Cave Temple and Minneriya or Kaudulla for safari. Sigiriya is a highlight of the Cultural Triangle. Best visited early morning to avoid heat and crowds.",
    sliderImages: sigiriyaSliderImages,
    images: sigiriyaImages,
    destinationInfo: [
      { label: "Region", value: "Central Province (Cultural Triangle)" },
      { label: "Height", value: "~200 m (rock)" },
      { label: "Best for", value: "History, climb, photography" },
    ],
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.5!2d80.7597!3d7.9570!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afc12e9d79d2f0f%3A0x3c2e1d2e3f4a5b6c!2sSigiriya%20Rock%20Fortress%2C%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1769682400000!5m2!1sen!2slk",
    faqs: [
      {
        question: "What is the best time to climb Sigiriya?",
        answer:
          "Early morning (around 7–8 am) to avoid heat and crowds. Bring water, hat, and comfortable shoes.",
      },
      {
        question: "How fit do I need to be for Sigiriya?",
        answer:
          "There are steep steps and narrow passages. Moderate fitness is enough; take breaks. Not recommended for severe fear of heights.",
      },
      {
        question: "How long does the climb take?",
        answer:
          "About 2–3 hours round trip including time at the top. Allow half a day with the museum and gardens.",
      },
      {
        question: "Can I combine Sigiriya with other sites?",
        answer:
          "Yes. Dambulla Cave Temple is nearby. Minneriya or Kaudulla national parks are popular for elephant safaris in the dry season.",
      },
    ],
  },
};

/**
 * Get destination data by slug. Slugs: kandy, galle, ella, arugampe, sigiriya.
 * Falls back to first available if slug is missing (e.g. kandy).
 */
export function getDestinationData(slug) {
  const key = (slug || "kandy").toLowerCase().replace(/\s+/g, "");
  return destinationDetailsBySlug[key] || destinationDetailsBySlug.kandy;
}

export default destinationDetailsBySlug;
