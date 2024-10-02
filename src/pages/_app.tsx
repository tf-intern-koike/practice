import "@/styles/globals.css";
import { MarkGameProvider } from "@/providers/MarkGameProvider";
import { ReversiProvider } from "@/providers/ReversiProvider";
import type { AppProps } from "next/app";


export default function App({ Component, pageProps }: AppProps) {
  return <MarkGameProvider><ReversiProvider>
    <Component {...pageProps} />
    </ReversiProvider></MarkGameProvider>;
}
