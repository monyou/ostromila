import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useGlobalContext from "../contexts/global";

const Custom403: NextPage = () => {
  const {
    state: { translate },
  } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    var root = document.documentElement;
    var eyef = document.getElementById("eyef");
    var cx = Number(document.getElementById("eyef")?.getAttribute("cx"));
    var cy = Number(document.getElementById("eyef")?.getAttribute("cy"));

    document.addEventListener("mousemove", (evt) => {
      let x = evt.clientX / innerWidth;
      let y = evt.clientY / innerHeight;

      root.style.setProperty("--mouse-x", x.toString());
      root.style.setProperty("--mouse-y", y.toString());

      cx = 115 + 30 * x;
      cy = 50 + 30 * y;
      eyef?.setAttribute("cx", cx.toString());
      eyef?.setAttribute("cy", cy.toString());
    });

    document.addEventListener("touchmove", (touchHandler) => {
      let x = touchHandler.touches[0].clientX / innerWidth;
      let y = touchHandler.touches[0].clientY / innerHeight;

      root.style.setProperty("--mouse-x", x.toString());
      root.style.setProperty("--mouse-y", y.toString());
    });
  }, []);

  return (
    <div
      id="access-denied-page"
      css={{
        fontFamily: "Poppins, sans-serif",
        paddingTop: 150,
        textAlign: "center",

        "@media (max-width: 576px)": {
          paddingTop: 200,
        },
      }}
    >
      <Head>
        <title>{translate.AccessDeniedPage.meta_title}</title>
        <meta
          name="description"
          content={translate.AccessDeniedPage.meta_title}
        />
      </Head>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        id="robot-error"
        viewBox="0 0 260 118.9"
        css={{ width: "50vw" }}
      >
        <defs>
          <clipPath id="white-clip">
            <circle id="white-eye" fill="#cacaca" cx="130" cy="65" r="20" />{" "}
          </clipPath>
          <text
            css={{ fontSize: 120, fontFamily: "Bungee, cursive" }}
            id="text-s"
            className="error-text"
            y="106"
          >
            {" "}
            403{" "}
          </text>
        </defs>
        <path
          css={{ animation: "alarmOn 0.5s infinite" }}
          className="alarm"
          fill="#e62326"
          d="M120.9 19.6V9.1c0-5 4.1-9.1 9.1-9.1h0c5 0 9.1 4.1 9.1 9.1v10.6"
        />
        <use xlinkHref="#text-s" x="-0.5px" y="-1px" fill="black"></use>
        <use xlinkHref="#text-s" fill="#2b2b2b"></use>
        <g id="robot">
          <g id="eye-wrap" css={{ overflow: "hidden" }}>
            <use xlinkHref="#white-eye"></use>
            <circle
              css={{
                cx: "calc(115px + 30px * var(--mouse-x))",
                cy: "calc(50px + 30px * var(--mouse-y))",
              }}
              id="eyef"
              className="eye"
              clipPath="url(#white-clip)"
              fill="#000"
              stroke="#2aa7cc"
              strokeWidth="2"
              strokeMiterlimit="10"
              cx="130"
              cy="65"
              r="11"
            />
            <ellipse
              id="white-eye"
              fill="#2b2b2b"
              cx="130"
              cy="40"
              rx="18"
              ry="12"
            />
          </g>
          <circle
            css={{ fill: "#444" }}
            className="lightblue"
            cx="105"
            cy="32"
            r="2.5"
            id="tornillo"
          />
          <use xlinkHref="#tornillo" x="50"></use>
          <use xlinkHref="#tornillo" x="50" y="60"></use>
          <use xlinkHref="#tornillo" y="60"></use>
        </g>
      </svg>
      <h1>{translate.AccessDeniedPage.title}</h1>
      <h3>
        {translate.AccessDeniedPage.go}{" "}
        <span
          css={{
            color: "#2aa7cc",
            cursor: "pointer",
            ":hover": { color: "initial" },
          }}
          onClick={() => router.back()}
        >
          {translate.AccessDeniedPage.back}
        </span>
      </h3>
    </div>
  );
};

export default Custom403;
