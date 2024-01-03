import "@/styles/globals.css";
import type { AppProps } from "next/app";
import localFont from "next/font/local";

import { Instrument_Serif, Instrument_Sans } from "next/font/google";

const tobias = localFont({
  src: [
    {
      path: "./fonts/tobias/TobiasTRIAL-ThinItalic.woff2",
      weight: "100",
      style: "italic",
    },
    {
      path: "./fonts/tobias/TobiasTRIAL-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    // {
    //   path: "./fonts/tobias/TobiasTRIAL-ExtraLightItalic.woff2",
    //   weight: "200",
    //   style: "italic",
    // },
    // {
    //   path: "./fonts/tobias/TobiasTRIAL-ExtraLight.woff2",
    //   weight: "200",
    //   style: "normal",
    // },
    {
      path: "./fonts/tobias/TobiasTRIAL-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "./fonts/tobias/TobiasTRIAL-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/tobias/TobiasTRIAL-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/tobias/TobiasTRIAL-RegularItalic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/tobias/TobiasTRIAL-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/tobias/TobiasTRIAL-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "./fonts/tobias/TobiasTRIAL-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/tobias/TobiasTRIAL-SemiBoldItalic.woff2",
      weight: "600",
      style: "italic",
    },
    {
      path: "./fonts/tobias/TobiasTRIAL-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/tobias/TobiasTRIAL-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "./fonts/tobias/TobiasTRIAL-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/tobias/TobiasTRIAL-ExtraBoldItalic.woff2",
      weight: "800",
      style: "italic",
    },
    {
      path: "./fonts/tobias/TobiasTRIAL-Heavy.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/tobias/TobiasTRIAL-HeavyItalic.woff2",
      weight: "900",
      style: "italic",
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
      <Component {...pageProps} />
    </main>
  );
}
