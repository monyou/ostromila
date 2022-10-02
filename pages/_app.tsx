import "../styles/globals.scss";
import type { AppProps } from "next/app";
import MainLayout from "../layouts/MainLayout";
import { GlobalContextProvider } from "../contexts/global";

export const AUTH_TOKEN = process.env.NEXT_PUBLIC_AUTH_USER_COOKIE_TOKEN;

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <GlobalContextProvider>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </GlobalContextProvider>
  );
};

export default MyApp;
