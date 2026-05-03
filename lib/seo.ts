import type { Metadata } from "next";
import { getSiteUrl, isProductionEnvironment } from "@/lib/site-config";

const siteUrl = getSiteUrl();
const isProduction = isProductionEnvironment();

export function getBaseMetadata(): Metadata {
 return {
  metadataBase: new URL(siteUrl),
  title: {
   default: "Rijad Rajkic | Software Engineer",
   template: "%s | Rijad Rajkic",
  },
  description: "Software engineer building full-stack web applications with TypeScript, React, and Next.js.",
  openGraph: {
   type: "website",
   siteName: "Rijad Rajkic",
   url: siteUrl,
   title: "Rijad Rajkic | Software Engineer",
   description: "Software engineer building full-stack web applications with TypeScript, React, and Next.js.",
   images: [
    {
     url: "/og-image.jpg",
     width: 1200,
     height: 630,
     alt: "Rijad Rajkic portfolio",
    },
   ],
  },
  twitter: {
   card: "summary_large_image",
   title: "Rijad Rajkic | Software Engineer",
   description: "Software engineer building full-stack web applications with TypeScript, React, and Next.js.",
   images: ["/og-image.jpg"],
  },
  robots: {
   index: isProduction,
   follow: isProduction,
  },
 };
}

export function personJsonLd() {
 return {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Rijad Rajkic",
  url: siteUrl,
  jobTitle: "Software Engineer",
  description: "Software engineer building full-stack web applications with TypeScript, React, and Next.js.",
  sameAs: ["https://github.com/RijadRajkic", "https://www.linkedin.com/in/rijad-rajkic"],
 };
}
