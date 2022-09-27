import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import GlobalLoader from "../components/Loader";
import useGlobalContext from "../contexts/global";
import { ToastContainer } from "react-toastify";
import { HomeOutlined, ToolOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useRouter } from "next/router";
import type { ItemType } from "antd/lib/menu/hooks/useItems";
import { useEffect, useState } from "react";
import logoImg from "../public/assets/logo.png";
import Image from "next/image";
import { io, Socket } from "socket.io-client";

const { Content, Footer, Sider } = Layout;

export let socket: Socket | null = null;

const MainLayout = (props: any) => {
  const {
    state: { loading, translate },
  } = useGlobalContext();
  const router = useRouter();

  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(true);

  useEffect(() => {
    const openWS = async () => {
      await fetch(process.env.NEXT_PUBLIC_SERVER_URL + "/ws");
      socket = io();
    };

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
            onClick={() => {
              if (document.body.clientWidth < 576) {
                setSidebarCollapsed(true);
              }
              router.push("/");
            }}
            css={{ cursor: "pointer", textAlign: "center", padding: 5 }}
          >
            <Image src={logoImg} alt="logo" width={107} height={80} />
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[router?.asPath || ""]}
            triggerSubMenuAction="click"
            items={getMenuItems()}
            onClick={(info) => {
              if (document.body.clientWidth < 576) {
                setSidebarCollapsed(true);
              }
              router.push(info.key);
            }}
          />
        </Sider>
        <Layout>
          <Content css={{ margin: "0px 40px" }}>
            <div>{props.children}</div>
          </Content>
          <Footer css={{ textAlign: "center", padding: 12 }}>
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
