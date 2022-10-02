import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import useGlobalContext, { type GlobalState } from "../contexts/global";
import { toast } from "react-toastify";
import { deleteCookie } from "./withAuth";
import { AUTH_TOKEN } from "../pages/_app";

export type ApiResponse<T> = {
  Exception: string;
  Result: T;
  Success: boolean;
};

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

function useMakeAjaxRequest<T>(
  options: { url?: string; lazy?: boolean; params?: RequestInit } = {
    url: "",
    lazy: false,
    params: {},
  }
) {
  const [response, setResponse] = useState<T>();
  const {
    state: { translate },
    dispatch,
  } = useGlobalContext();
  const router = useRouter();

  const makeRequest = useCallback(
    async (innerOptions: { url?: string; params?: RequestInit } = {}) => {
      dispatch({ loading: true } as GlobalState);
      const response = await fetch(
        baseUrl + (innerOptions.url || options.url)!,
        {
          method: "get",
          credentials: "include",
          ...options.params,
          ...innerOptions.params,
        }
      );
      const json = (await response.json()) as ApiResponse<T>;
      dispatch({ loading: false } as GlobalState);

      if (json.Success) {
        setResponse(json.Result);
        return json.Result;
      } else {
        switch (json.Exception) {
          case "403":
            deleteCookie(AUTH_TOKEN!);
            router.replace("/login");
            break;
        }
        toast.error(translate.ApiErrors[json.Exception]);
        return null;
      }
    },
    []
  );

  useEffect(() => {
    if (options.lazy) return;

    makeRequest();
  }, []);

  return { response, makeRequest };
}

export default useMakeAjaxRequest;
