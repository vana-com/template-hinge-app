import "@/styles/globals.css";
import type { AppProps } from "next/app";
import localFont from "next/font/local";

import { Instrument_Sans } from "next/font/google";
import Head from "next/head";

const tobias = localFont({
  src: [
    // Only one font used
    {
      path: "./fonts/Tobias-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-tobias",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: "400",
  display: "fallback",
  variable: "--font-instrument-sans",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${tobias.variable} ${instrumentSans.variable} font-sans`}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <title key="title">Vana Hinge Copilot</title>
        <meta
          name="description"
          content="Craft your perfect dating profile with the help of your Gotchi"
        />
        {/* Heart emoji as favicon */}
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>❤️</text></svg>"
        />
        {/* Social image */}
        <meta
          property="og:image"
          content="https://vana-hinge-app.vercel.vana.com/social.jpg"
        />
      </Head>

      <Component {...pageProps} />
    </main>
  );
}
