import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import GlobalLoader from "../components/Loader";
import { ToastContainer } from "react-toastify";
import { HomeOutlined, ToolOutlined, LogoutOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import type { ItemType } from "antd/lib/menu/hooks/useItems";
import { useEffect, useState } from "react";
import logoImg from "../public/assets/logo.png";
import Image from "next/image";
import { io, Socket } from "socket.io-client";
import { deleteCookie, getCookie } from "../utils/withAuth";
import { AUTH_TOKEN } from "../pages/_app";
import { selectGlobalLoading } from "../redux/slices/globalSlice";
import { useSelector } from "react-redux";
import useGetTranslation from "../utils/getTranslation";

const { Content, Footer, Sider } = Layout;

export let socket: Socket | null = null;

const MainLayout = (props: any) => {
  const loading = useSelector(selectGlobalLoading);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(true);
  const [token, setToken] = useState<string>();
  const { translate, router } = useGetTranslation();

  useEffect(() => {
    const auth_token = getCookie(AUTH_TOKEN!);

    if (token === auth_token) return;

    setToken(auth_token);
  });

  useEffect(() => {
    const openWS = async () => {
      await fetch(process.env.NEXT_PUBLIC_SERVER_URL + "/ws");
      socket = io();
    };

    setTimeout(() => {
      const content = document.querySelector(
        ".ant-layout-content"
      ) as HTMLElement;

      document
        .querySelector(".ant-layout-sider")
        ?.addEventListener("click", (e) => {
          if (document.body.clientWidth > 576) return;

          const clicked = e.target as HTMLElement;

          if (
            !clicked.classList.contains(
              "ant-layout-sider-zero-width-trigger"
            ) &&
            !clicked.classList.contains("ant-menu-title-content") &&
            clicked.getAttribute("id") !== "logo" &&
            clicked.getAttribute("alt") !== "logo"
          )
            return;

          if (document.querySelector(".ant-layout-sider-zero-width")) {
            content.style.zIndex = "-1";
          } else {
            content.style.zIndex = "initial";
          }
        });
    }, 100);

    openWS();
  }, []);

  const getMenuItems = (): ItemType[] => {
    const items: ItemType[] = [
      {
        label: translate.MainLayout.MenuItem1,
        icon: <HomeOutlined />,
        key: "/buildings/144",
      },
      {
        label: translate.MainLayout.MenuItem2,
        icon: <HomeOutlined />,
        key: "/buildings/146",
      },
      {
        label: translate.MainLayout.MenuItem3,
        icon: <ToolOutlined />,
        key: "/admin",
      },
    ];

    if (token) {
      items.push({
        label: translate.MainLayout.MenuItemLogout,
        icon: <LogoutOutlined />,
        key: "logout",
      });
    }

    return items;
  };

  return (
    <div id="main-layout">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png"></link>
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>

      <Layout css={{ minHeight: "100vh" }}>
        <Sider
          breakpoint="sm"
          collapsedWidth="0"
          collapsed={sidebarCollapsed}
          onCollapse={(value) => setSidebarCollapsed(value)}
        >
          <div
            id="logo"
            onClick={() => {
              if (document.body.clientWidth < 576) {
                setSidebarCollapsed(true);
              }
              router.push("/");
            }}
            css={{ cursor: "pointer", position: "relative", top: -45 }}
          >
            <Image src={logoImg} alt="logo" width={200} />
          </div>
          <Menu
            css={{ position: "relative", top: -90 }}
            theme="dark"
            mode="inline"
            selectedKeys={[router?.asPath || ""]}
            triggerSubMenuAction="click"
            items={getMenuItems()}
            onClick={(info) => {
              if (document.body.clientWidth < 576) {
                setSidebarCollapsed(true);
              }
              if (info.key === "logout") {
                deleteCookie(AUTH_TOKEN!);
                router.replace("/login");
              } else router.push(info.key);
            }}
          />
        </Sider>
        <Layout
          css={{
            background: router?.route === "/" ? "red" : "initial",
          }}
        >
          <Content css={{ margin: "0px 40px" }}>
            <div>{props.children}</div>
          </Content>
          <Footer
            css={{
              textAlign: "center",
              padding: 12,
              background: router?.route === "/" ? "red" : "initial",
              color: router?.route === "/" ? "whitesmoke" : "initial",
            }}
          >
            ©{new Date().getFullYear()} Created by Simeon Mechkov
          </Footer>
        </Layout>
      </Layout>

      {loading && <GlobalLoader />}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
      />
    </div>
  );
};

export default MainLayout;
