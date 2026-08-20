import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import TornDivider from "@/components/TornDivider";
import EncyclopediaHero from "@/components/encyclopedia/EncyclopediaHero";
import EncyclopediaBrowser from "@/components/encyclopedia/EncyclopediaBrowser";
import { fetchArtists } from "@/lib/sheetData";

// Sheet data changes as HOLLERBOSS adds artists — revalidate periodically
// rather than only at build time.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "The Encyclopedia",
  description: "The artists, their stories, and the songs that built this sound.",
};

export default async function EncyclopediaPage() {
  // Every artist in the sheet gets an encyclopedia entry — calendar=NO
  // just means "not currently touring," which scopes the Route Sheet
  // (see lib/liveShows.ts), not who belongs in the encyclopedia.
  const artists = await fetchArtists();

  return (
    <>
      <Nav />
      <main id="main">
        <EncyclopediaHero />
        <TornDivider fill="kraft" />
        <EncyclopediaBrowser artists={artists} />
      </main>
      <Footer />
    </>
  );
}
