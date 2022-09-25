import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import locales, { type Locale } from "../utils/locales";

export type GlobalState = {
  translate: Locale;
  loading: boolean;
};

type ContextProvider = {
  state: GlobalState;
  dispatch: (newState: GlobalState) => void;
};

const GlobalContext = createContext<ContextProvider>({
  state: {} as GlobalState,
  dispatch: () => {},
});

export const GlobalContextProvider = (props: any) => {
  const { locale, defaultLocale } = useRouter();
  const [globalState, setGlobalState] = useState<GlobalState>({
    translate: locales[defaultLocale!],
    loading: false,
  });

  useEffect(() => {
    setGlobalState((oldState) => ({
      ...oldState,
      translate: locales[locale!] || locales[defaultLocale!],
    }));
  }, [locale]);

  return (
    <GlobalContext.Provider
      value={{
        state: globalState,
        dispatch: (newState) => {
          setGlobalState((oldState) => ({
            ...oldState,
            ...newState,
          }));
        },
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};

const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export default useGlobalContext;
