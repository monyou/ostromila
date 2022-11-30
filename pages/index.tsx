import type { NextPage } from "next";
import Head from "next/head";
import useGetTranslation from "../utils/getTranslation";

const HomePage: NextPage = () => {
  const { translate } = useGetTranslation();

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
          color: "whitesmoke",
        }}
      >
        {translate.HomePage.title}
      </h1>
    </div>
  );
};

export default HomePage;
