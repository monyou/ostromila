import type { NextPage } from "next";
import Head from "next/head";
import useGetTranslation from "../utils/getTranslation";

const Custom404: NextPage = () => {
  const { translate, router } = useGetTranslation();

  return (
    <div id="not-found-page">
      <Head>
        <title>{translate.HomePage.meta_title}</title>
        <meta name="description" content={translate.HomePage.meta_title} />
      </Head>

      <div
        css={{
          position: "absolute",
          width: 434,
          height: 155,
          top: "calc(50% - 46px)",
          left: "calc(50% + 100px)",
          transform: "translate(-50%, -50%)",

          "@media (max-width: 576px)": {
            display: "block",
            position: "relative",
            top: 0,
            left: 0,
            transform: "none",
            width: 290,
            height: 200,
            margin: "0 auto",
            marginTop: 200,
          },
        }}
      >
        <div
          css={{
            position: "absolute",
            width: 30,
            height: 60,
            top: "calc(100% - 60px)",
            left: 15,
            backgroundColor: "#b5b5b5",
            borderRadius: 5,
            transform: "rotate(45deg)",

            "@media (max-width: 576px)": {
              top: "calc(50% - 8px)",
              left: 38,
            },
          }}
        ></div>
        <div
          css={{
            position: "absolute",
            width: 15,
            height: 20,
            top: "calc(100% - 69px)",
            left: 51,
            background: `linear-gradient(
              0deg,
              rgba(227, 227, 227, 1) 0%,
              rgba(227, 227, 227, 1) 70%,
              rgba(181, 181, 181, 1) 85%,
              rgba(181, 181, 181, 1) 100%
            )`,
            transform: "rotate(45deg)",

            "@media (max-width: 576px)": {
              top: "calc(50% - 17px)",
              left: "calc(50% - 70px)",
            },
          }}
        ></div>
        <div
          css={{
            position: "absolute",
            top: "calc(100% - 152px)",
            left: 50,
            width: 100,
            height: 100,
            borderRadius: "50%",
            borderStyle: "solid",
            borderWidth: 15,
            borderColor: "#e3e3e3",
            backgroundColor: "transparent",
            zIndex: 2,

            "@media (max-width: 576px)": {
              top: 0,
              left: "calc(50% - 70px)",
            },
          }}
        ></div>
        <div
          css={{
            position: "absolute",
            fontFamily: "Arial, Helvetica, sans-serif",
            top: "calc(100% - 128px)",
            left: 82,
            fontSize: " 2.5em",
            fontWeight: "bold",
            color: "#e65454",
            zIndex: 1,

            "@media (max-width: 576px)": {
              top: 23,
              left: "calc(50% - 40px)",
            },
          }}
        >
          {translate.NotFoundPage.text_logo}
        </div>
        <div
          css={{
            position: "absolute",
            top: "calc(100% - 25px)",
            left: 75,
            fontFamily: "Poppins, sans-serif",
            fontSize: " 1.2em",
            color: "#2f2f2f",

            "@media (max-width: 576px)": {
              textAlign: "center",
              left: 60,
              top: "calc(100% - 50px)",
            },
          }}
        >
          {translate.NotFoundPage.text}{" "}
          <span
            css={{
              textDecoration: "underline",
              transition: "all 0.5s",
              cursor: "pointer",

              ":hover": {
                color: "#e65454",
              },
            }}
            onClick={() => router.back()}
          >
            {translate.NotFoundPage.go_back}
          </span>{" "}
          .
        </div>
      </div>
    </div>
  );
};

export default Custom404;
