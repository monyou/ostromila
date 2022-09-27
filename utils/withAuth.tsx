import { UserType } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import type { LoggedUser } from "../pages/api/login";
import { AUTH_USER_SESSION } from "./makeAjaxRequest";

export const getLoggedInUser = (): LoggedUser | null => {
  const user = window?.sessionStorage?.getItem(AUTH_USER_SESSION);
  return user ? JSON.parse(user) : null;
};

const withAuth = (WrappedComponent: any, roles: UserType[] | null = null) => {
  return (props: any) => {
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const user = getLoggedInUser();
      if (!user) {
        router.replace("/login");
      } else {
        if (!roles || roles.includes(user.type)) {
          setAuthenticated(true);
        } else {
          router.replace("/403");
        }
      }
    }, []);

    if (!authenticated) return null;

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
