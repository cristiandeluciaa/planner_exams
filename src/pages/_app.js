import "../styles/globals.css";
import Head from 'next/head';
import {NextUIProvider} from "@nextui-org/react";
require("dotenv").config();
export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
      </Head>
      <NextUIProvider>
      <Component {...pageProps} />
      </NextUIProvider>
    </>
  )

}
