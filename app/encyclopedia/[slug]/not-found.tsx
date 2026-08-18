import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function ArtistNotFound() {
  return (
    <>
      <Nav />
      <main id="main">
        <section className="section">
          <div className="wrap" style={{ textAlign: "center", padding: "40px 0" }}>
            <p className="eyebrow">404</p>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", margin: "10px 0" }}>
              We don&apos;t have that one yet
            </h1>
            <p style={{ maxWidth: "48ch", margin: "0 auto 26px", opacity: 0.75 }}>
              That artist isn&apos;t in the encyclopedia — either the link&apos;s off, or they
              haven&apos;t made the cut yet.
            </p>
            <Link href="/encyclopedia" className="btn btn-primary">
              Back to the encyclopedia
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
