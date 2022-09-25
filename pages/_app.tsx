import "../styles/globals.scss";
import type { AppProps } from "next/app";
import MainLayout from "../layouts/MainLayout";
import { GlobalContextProvider } from "../contexts/global";

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
