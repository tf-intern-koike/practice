import "@/styles/globals.css";
import { MarkGameProvider } from "@/providers/MarkGameProvider";
import { ReversiProvider, ReversiProviderV2 } from "@/providers/ReversiProvider";
import type { AppProps } from "next/app";


export default function App({ Component, pageProps }: AppProps) {
  return <MarkGameProvider><ReversiProvider><ReversiProviderV2>
    <Component {...pageProps} />
    </ReversiProviderV2></ReversiProvider></MarkGameProvider>;
}
