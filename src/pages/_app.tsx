import "@/styles/globals.css";
import { MarkGameProvider } from "@/providers/MarkGameProvider";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <MarkGameProvider>
    <Component {...pageProps} />
  </MarkGameProvider>;
}
