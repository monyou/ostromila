import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AUTH_USER_SESSION } from "./makeAjaxRequest";

export const isAdminLoggedIn = (): boolean => {
  return !!window?.sessionStorage?.getItem(AUTH_USER_SESSION);
};

const withAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
      if (!isAdminLoggedIn()) {
        router.push("/admin/login");
      } else {
        setAuthenticated(true);
      }
    }, []);

    if (!authenticated) return null;

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
