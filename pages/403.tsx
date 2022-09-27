import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import useGlobalContext from "../contexts/global";

const Custom403: NextPage = () => {
  const {
    state: { translate },
  } = useGlobalContext();
  const router = useRouter();

  return (
    <div id="access-denied-page">
      <Head>
        <title>{translate.AccessDeniedPage.meta_title}</title>
        <meta
          name="description"
          content={translate.AccessDeniedPage.meta_title}
        />
      </Head>

      <h1>{translate.AccessDeniedPage.title}</h1>
    </div>
  );
};

export default Custom403;
