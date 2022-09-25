import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import useGlobalContext from "../contexts/global";

const Custom404: NextPage = () => {
  const {
    state: { translate },
  } = useGlobalContext();
  const router = useRouter();

  return (
    <div id="not-found-page">
      <Head>
        <title>{translate.HomePage.meta_title}</title>
        <meta name="description" content={translate.HomePage.meta_title} />
      </Head>

      <div id="container">
        <div id="handle1"></div>
        <div id="handle2"></div>
        <div id="glass"></div>
        <div id="text-logo">{translate.NotFoundPage.text_logo}</div>
        <div id="text">
          {translate.NotFoundPage.text}{" "}
          <span onClick={() => router.back()} id="go-back">
            {translate.NotFoundPage.go_back}
          </span>{" "}
          .
        </div>
      </div>
    </div>
  );
};

export default Custom404;
