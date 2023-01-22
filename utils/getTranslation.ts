import { useRouter } from "next/router";
import { useMemo } from "react";
import locales from "../public/locales";

const useGetTranslation = () => {
  const router = useRouter();
  const translate = useMemo(() => {
    return locales[router.locale!] || locales[router.defaultLocale!];
  }, [router.locale]);

  return { router, translate };
};

export default useGetTranslation;
