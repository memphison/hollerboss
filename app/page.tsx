import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import TornDivider from "@/components/TornDivider";
import Encyclopedia from "@/components/Encyclopedia";
import Shop from "@/components/Shop";
import JoinList from "@/components/JoinList";
import Footer from "@/components/Footer";
import RouteSheet from "@/components/RouteSheet";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <TornDivider fill="kraft" />
        <Encyclopedia />
        <TornDivider fill="ink" flipped />
        <RouteSheet />
        <TornDivider fill="kraft" />
        <Shop />
        <TornDivider fill="kraft" />
        <JoinList />
      </main>
      <Footer />
    </>
  );
}
