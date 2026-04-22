import localFont from "next/font/local";
import type { Metadata } from "next";
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";
import { getBaseMetadata } from "@/lib/seo";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const geistSans = localFont({
 src: "./fonts/GeistVF.woff",
 variable: "--font-geist-sans",
 weight: "100 900",
});

const geistMono = localFont({
 src: "./fonts/GeistMonoVF.woff",
 variable: "--font-geist-mono",
 weight: "100 900",
});

export const metadata: Metadata = getBaseMetadata();

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 return (
  <ViewTransitions>
   <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
    <body>
     {children}
     <SpeedInsights />
     <Analytics />
    </body>
   </html>
  </ViewTransitions>
 );
}
