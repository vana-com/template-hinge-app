import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

import Layout from "@/components/Layout"; // Assuming you have a Layout component
import { SWRConfig } from "swr";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className="font-sans">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <title key="title">Template App</title>
        <meta name="description" content="Vana Gotchi template app." />
        {/* Favicon */}
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📸</text></svg>"
        />
        {/* Social image */}
        <meta
          property="og:image"
          content="https://vana-hinge-app.vercel.vana.com/social.jpg"
        />
      </Head>

      <SWRConfig
        value={{
          fetcher: (resource, init) =>
            fetch(resource, init).then((res) => res.json()),
          onError: (error) => {
            console.error("SWR Error:", error);
          },
        }}
      >
        <div className="p-4 flex flex-col items-center min-h-screen">
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </div>
      </SWRConfig>
    </main>
  );
}
