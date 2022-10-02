import type { NextPage } from "next";
import Head from "next/head";
import useGlobalContext from "../contexts/global";

const HomePage: NextPage = () => {
  const {
    state: { translate },
  } = useGlobalContext();

  return (
    <div id="home-page">
      <Head>
        <title>{translate.HomePage.meta_title}</title>
        <meta name="description" content={translate.HomePage.meta_content} />
      </Head>

      <h1
        css={{
          lineHeight: "calc(100vh - 150px)",
          textAlign: "center",
        }}
      >
        {translate.HomePage.title}
      </h1>
    </div>
  );
};

export default HomePage;
