/**
 * Single source of truth for brand-level copy, links, and product details.
 * Change it here, it changes everywhere on the site.
 *
 * House rule: the brand name is HOLLERBOSS - one word, never "Holler Boss".
 */

export const site = {
  name: "HOLLERBOSS",
  tagline: "An Appalachian songbook",
  description:
    "A curated encyclopedia of the artists carrying Appalachian country and roots music forward - who they are, what to listen to first, and where to find them.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://hollerboss.com",
  socials: [
    { label: "Instagram", href: "https://instagram.com/hollerboss" },
    { label: "TikTok", href: "https://tiktok.com/@hollerboss" },
    { label: "YouTube", href: "https://www.youtube.com/@Hollerboss" },
    { label: "Facebook", href: "https://https://www.facebook.com/hollerbossofficial" },
  ],
  nav: [
    { label: "Encyclopedia", href: "/encyclopedia" },
    { label: "Route Sheet", href: "/route-sheet" },
    { label: "Shop", href: "/#shop" },
    { label: "Join", href: "/#join" },
  ],
  hat: {
    name: "The HOLLERBOSS Trucker Hat",
    price: "$32",
    priceNote: "pre-order · ships when the first run lands",
    copy:
      'Black five-panel, structured front, mesh back. "HOLLERBOSS" raised in white embroidery, straight across. One hat, done right, before anything else.',
    image: "/images/hat.png",
    imageAlt:
      "Black trucker hat with HOLLERBOSS embroidered in raised white letters across the front",
  },
  disclaimer:
    "HOLLERBOSS is an independent fan project. Not affiliated with or endorsed by any artist listed. All artist names are used for editorial/informational purposes only.",
};
