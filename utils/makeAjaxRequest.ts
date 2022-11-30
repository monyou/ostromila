import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { deleteCookie } from "./withAuth";
import { AUTH_TOKEN } from "../pages/_app";
import { useDispatch } from "react-redux";
import { setLoading } from "../redux/slices/globalSlice";
import useGetTranslation from "./getTranslation";

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
  const { translate, router } = useGetTranslation();
  const dispatch = useDispatch();

  const makeRequest = useCallback(
    async (innerOptions: { url?: string; params?: RequestInit } = {}) => {
      dispatch(setLoading(true));
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
      dispatch(setLoading(false));

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
        toast.error(translate.ApiErrors[json.Exception], {
          toastId: "ajax-error",
        });
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
