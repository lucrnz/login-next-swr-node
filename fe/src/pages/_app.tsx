import { SWRConfig } from "swr";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { APP_NAME } from "@/config";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{ provider: () => new Map() }}>
      <Head>
        <title>{APP_NAME}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Component {...pageProps} />
    </SWRConfig>
  );
}
