import "../style/styles.css";
import type { Metadata } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
 title: "My Website",
 description: "",
};

export default function MyApp({ Component, pageProps }: AppProps) {
 return (
  <main className={inter.className}>
   <Head>
    <title>{metadata.title as string}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
   </Head>
   <Component {...pageProps} />
  </main>
 );
}
