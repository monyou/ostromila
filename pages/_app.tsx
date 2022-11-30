import "../styles/globals.scss";
import type { AppProps } from "next/app";
import MainLayout from "../layouts/MainLayout";
import storeWrapper from "../redux/store";
import { Provider } from "react-redux";

export const AUTH_TOKEN = process.env.NEXT_PUBLIC_AUTH_USER_COOKIE_TOKEN;

const MyApp = ({ Component, ...rest }: AppProps) => {
  const { store, props } = storeWrapper.useWrappedStore(rest);
  return (
    <Provider store={store}>
      <MainLayout>
        <Component {...props.pageProps} />
      </MainLayout>
    </Provider>
  );
};

export default MyApp;
