import type { NextPage } from "next";
import Head from "next/head";
import useGlobalContext from "../contexts/global";
import useMakeAjaxRequest, {
  AUTH_USER_SESSION,
} from "../utils/makeAjaxRequest";
import { Button, Form, Input } from "antd";
import { LoggedUser } from "./api/login";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getLoggedInUser } from "../utils/withAuth";
import { UserType } from "@prisma/client";

const LoginPage: NextPage = () => {
  const [seePage, setSeePage] = useState(false);
  const {
    state: { translate },
  } = useGlobalContext();
  const router = useRouter();
  const { makeRequest } = useMakeAjaxRequest<LoggedUser>({
    url: "/login",
    lazy: true,
    params: {
      method: "post",
    },
  });

  useEffect(() => {
    const user = getLoggedInUser();
    if (user) {
      if (user.type !== UserType.Guest) {
        router.replace("/admin");
      } else {
        router.replace("/buildings/144");
      }
    } else {
      setSeePage(true);
    }
  }, []);

  const onFinish = async (values: any) => {
    const body = JSON.stringify(values);

    const user = await makeRequest({
      params: {
        body,
      },
    });

    if (!user) return;

    sessionStorage.setItem(
      AUTH_USER_SESSION,
      JSON.stringify({ ...user, ...values })
    );

    if (user.type !== UserType.Guest) {
      router.replace("/admin");
    } else {
      router.replace("/buildings/144");
    }
  };

  if (!seePage) return null;

  return (
    <div id="login-page">
      <Head>
        <title>{translate.LoginPage.meta_title}</title>
        <meta name="description" content={translate.LoginPage.meta_content} />
      </Head>

      <h1 css={{ textAlign: "center", marginTop: 20 }}>
        {translate.LoginPage.title}
      </h1>

      <Form
        css={{ marginTop: 20 }}
        labelCol={{ span: 10 }}
        wrapperCol={{ xxl: { span: 5 }, sm: { span: 10 } }}
        labelWrap
        name="login_form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="on"
      >
        <Form.Item
          label={translate.LoginPage.username.label}
          name="username"
          rules={[
            {
              required: true,
              message: translate.LoginPage.username.error,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={translate.LoginPage.password.label}
          name="password"
          rules={[
            {
              required: true,
              message: translate.LoginPage.password.error,
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 10, span: 14 }}>
          <Button type="primary" htmlType="submit">
            {translate.LoginPage.submit}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
