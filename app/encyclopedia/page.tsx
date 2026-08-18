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
  const allArtists = await fetchArtists();
  // Only artists HOLLERBOSS is actively curating show up here — same
  // calendar=YES gate the Route Sheet uses, so an artist pulled from
  // rotation (calendar=NO) doesn't linger in the public encyclopedia.
  const artists = allArtists.filter((a) => a.calendar);

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
