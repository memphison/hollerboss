import type { Metadata, Viewport } from "next";
import { Anton, Lora, Special_Elite } from "next/font/google";
import { site } from "@/lib/site";
import GrainOverlay from "@/components/GrainOverlay";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-anton",
});

const lora = Lora({
  weight: ["400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lora",
});

const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-special-elite",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#241D14",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${lora.variable} ${specialElite.variable}`}
    >
      <body>
        <a href="#main" className="skipLink">
          Skip to content
        </a>
        <GrainOverlay />
        {children}
      </body>
    </html>
  );
}
