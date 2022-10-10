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
    <div
      id="access-denied-page"
      css={{
        fontFamily: "Comfortaa",
        textAlign: "center",
        paddingTop: 200,
      }}
    >
      <Head>
        <title>{translate.AccessDeniedPage.meta_title}</title>
        <meta
          name="description"
          content={translate.AccessDeniedPage.meta_title}
        />
      </Head>

      <h1
        css={{
          fontSize: 100,
          color: "white",
          fontWeight: 100,
          margin: 0,
        }}
      >
        4
        <div
          id="lock"
          css={{
            display: "inline-block",
            position: "relative",
            overflow: "hidden",
            "::after": {
              content: "''",
              backgroundColor: "#F76B1C33",
              display: "block",
              position: "absolute",
              height: 40,
              width: "50%",
              bottom: 0,
              left: 0,
            },
          }}
        >
          <div
            id="top"
            css={{
              height: 60,
              width: 50,
              borderRadius: "50%",
              border: "10px solid #fff",
              display: "block",
              position: "relative",
              top: 30,
              margin: "0 auto",
              "&::after": {
                padding: 10,
                borderRadius: "50%",
              },
            }}
          ></div>
          <div
            id="bottom"
            css={{
              background: "#D68910",
              height: 40,
              width: 60,
              display: "block",
              position: "relative",
              margin: "0 auto",
            }}
          ></div>
        </div>
        3
      </h1>
      <p>{translate.AccessDeniedPage.title}</p>
      <p>
        {translate.AccessDeniedPage.go}{" "}
        <span
          css={{
            textDecoration: "underline",
            transition: "all 0.5s",
            cursor: "pointer",

            ":hover": {
              color: "#D68910",
            },
          }}
          onClick={() => router.back()}
        >
          {translate.AccessDeniedPage.back}
        </span>{" "}
        .
      </p>
    </div>
  );
};

export default Custom403;
