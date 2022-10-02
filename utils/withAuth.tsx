import type { UserType } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AUTH_TOKEN } from "../pages/_app";
import jwt from "jsonwebtoken";

export const setCookie = (
  cName: string,
  cValue: string,
  expDays: number,
  path: string = "/"
): void => {
  let date = new Date();
  date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);
  const expires = `Expires=${date.toUTCString()};`;
  const secure = process.env.NODE_ENV === "production" ? " Secure;" : " ";
  const pathStr = `Path=${path};`;
  document.cookie = `${cName}=${cValue}; ${expires}${secure}${pathStr}`;
};

export const deleteCookie = (cName: string, path: string = "/"): void => {
  document.cookie = `${cName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
};

export const getCookie = (cName: string): string | undefined => {
  const name = cName + "=";
  const cDecoded = decodeURIComponent(document.cookie);
  const cArr = cDecoded.split("; ");
  let res;
  cArr.forEach((val) => {
    if (val.indexOf(name) === 0) res = val.substring(name.length);
  });
  return res;
};

const withAuth = (WrappedComponent: any, roles: UserType[] | null = null) => {
  return (props: any) => {
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const token = getCookie(AUTH_TOKEN!) || null;

      if (!token) {
        router.replace("/login");
        return;
      }

      const { type } = jwt.verify(
        token,
        process.env.NEXT_PUBLIC_AUTH_TOKEN_SECRET!
      ) as { type: UserType };

      if (!roles || roles.includes(type)) {
        setAuthenticated(true);
      } else {
        router.replace("/403");
      }
    }, []);

    if (!authenticated) return null;

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
