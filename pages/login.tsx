import type { NextApiRequest, NextPage } from "next";
import Head from "next/head";
import useGlobalContext from "../contexts/global";
import useMakeAjaxRequest from "../utils/makeAjaxRequest";
import { Button, Form, Input } from "antd";
import { LoggedUser } from "./api/login";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { UserType } from "@prisma/client";
import { setCookie } from "../utils/withAuth";
import { AUTH_TOKEN } from "./_app";
import jwt from "jsonwebtoken";

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  return {
    props: {
      token: req.cookies[AUTH_TOKEN!] || null,
    },
  };
};

const LoginPage: NextPage<{ token: string }> = ({ token }) => {
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
    if (!token) {
      setSeePage(true);
      return;
    }

    const { type } = jwt.verify(
      token,
      process.env.NEXT_PUBLIC_AUTH_TOKEN_SECRET!
    ) as { type: UserType };

    if (type !== UserType.Guest) {
      router.replace("/admin");
    } else {
      router.replace("/buildings/144");
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

    setCookie(AUTH_TOKEN!, user.token, 7);

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
        layout={"vertical"}
        wrapperCol={{ md: { span: 15 }, xl: { span: 10 }, xxl: { span: 5 } }}
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

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {translate.LoginPage.submit}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
