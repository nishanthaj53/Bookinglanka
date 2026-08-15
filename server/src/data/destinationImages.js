/** Wikimedia Commons files (real Sri Lanka places). */
export function wikimediaFile(filename) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}`;
}

export const DESTINATION_PLACE_IMAGES = {
  galle: wikimediaFile("Galle Fort.jpg"),
  "arugam-bay": wikimediaFile("Arugam Bay.jpg"),
  ella: wikimediaFile("Nine Arch Bridge Ella Sri Lanka.jpg"),
  colombo: wikimediaFile("Colombo skyline.jpg"),
  sigiriya: wikimediaFile("Sigiriya.jpg"),
  kandy: wikimediaFile("Temple of the Tooth, Kandy.jpg"),
  "nuwara-eliya": wikimediaFile("Nuwara Eliya.jpg"),
  jaffna: "/images/destinations/jaffna-nallur.png",
};

export const JAFFNA_GALLERY = [
  "/images/destinations/jaffna-nallur.png",
  wikimediaFile("Jaffna Fort.jpg"),
];
