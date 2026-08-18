import Image from "next/image";
import { site } from "@/lib/site";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <header className={styles.hero} id="top">
      <div className={styles.overlay} aria-hidden="true" />
      {/* Topographic dot/contour overlay — disabled per Jenn/Martin request, keep for possible reinstatement.
      <div className={styles.halftone} aria-hidden="true" />
      <svg
        className={styles.ridge}
        aria-hidden="true"
        viewBox="0 0 1200 500"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline
          points="-20,420 60,380 110,410 180,320 240,360 300,270 360,330 430,240 500,300 560,220 630,290 700,200 770,260 840,190 910,250 980,180 1050,240 1120,210 1220,260"
          fill="none"
          stroke="#3A4A2E"
          strokeWidth="3"
          opacity="0.55"
        />
        <polyline
          points="-20,460 70,430 130,450 200,390 260,410 330,350 400,390 470,330 540,370 610,320 680,360 750,310 820,350 890,300 960,340 1030,300 1100,330 1220,310"
          fill="none"
          stroke="#4A5A3A"
          strokeWidth="2.5"
          opacity="0.4"
        />
        <polyline
          points="-20,490 90,470 160,485 240,450 320,465 400,430 480,455 560,420 640,445 720,415 800,435 880,405 960,425 1040,400 1220,415"
          fill="none"
          stroke="#C6912E"
          strokeWidth="2"
          opacity="0.5"
        />
      </svg>
      */}

      <div className={`wrap ${styles.inner}`}>
        <p className="eyebrow">— an appalachian songbook —</p>
        <h1 className={styles.wordmarkHero}>
          <Image
            src="/images/logo_neutral_trim.png"
            alt={site.name}
            width={1837}
            height={389}
            priority
            sizes="(min-width: 760px) 680px, 88vw"
          />
        </h1>
        <p className={styles.tagline}>
          
Songs shaped by mountains and mandolins, front porches, and generations of tradition. Every artist carrying this music forward, the songs to start on, the deep cut nobody&apos;s told you about yet, and the noise to tune out.
        </p>
        <div className={styles.ctaRow}>
          <a href="#encyclopedia" className="btn btn-primary">
            Browse the encyclopedia
          </a>
          <a href="#shop" className="btn btn-ghost">
            Shop the hat
          </a>
        </div>
      </div>
    </header>
  );
}
