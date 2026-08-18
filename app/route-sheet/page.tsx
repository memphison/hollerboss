import { Suspense } from "react";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RouteSheet from "@/components/RouteSheet";

export const metadata: Metadata = {
  title: "The Route Sheet",
  description: "Drop in your zip code and find out which HOLLERBOSS-loved artists are headed your way.",
};

export default function RouteSheetPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <Suspense fallback={null}>
          <RouteSheet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
