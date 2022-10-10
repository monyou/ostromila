import type { NextPage } from "next";
import Head from "next/head";
import useGlobalContext from "../../contexts/global";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import useMakeAjaxRequest from "../../utils/makeAjaxRequest";
import type { BuildingFull } from "../api/building";
import { useCallback, useEffect, useState } from "react";
import isApartmentTaxPaid from "../../utils/isApartmentTaxPaid";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { type Report, UserType } from "@prisma/client";
import { socket } from "../../layouts/MainLayout";
import { Popover, Collapse } from "antd";
import ApartmentInfo from "../../components/ApartmentInfo";
import withAuth from "../../utils/withAuth";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import type { MessageFull } from "../api/message/all";
import moment from "moment";

const Tile = styled("div")({
  borderRadius: 10,
  backgroundColor: "white",
  padding: 18,
  width: "100%",
  overflow: "auto",
});

const BuildingPage: NextPage = () => {
  const {
    state: { translate },
  } = useGlobalContext();
  const {
    push,
    query: { buildingNumber },
  } = useRouter();

  const [building, setBuilding] = useState<BuildingFull>();
  const [messages, setMessages] = useState<MessageFull[]>();

  const { response: buildingFromApi, makeRequest: fetchBuilding } =
    useMakeAjaxRequest<BuildingFull>({
      lazy: true,
    });
  const { response: messagesFromApi, makeRequest: fetchMessages } =
    useMakeAjaxRequest<MessageFull[]>({
      lazy: true,
    });

  useEffect(() => {
    if (!buildingNumber) return;

    if (!Number(buildingNumber)) {
      push("/404");
      return;
    }

    const getData = async () => {
      const data = await fetchBuilding({
        url: `/building?buildingNumber=${buildingNumber}`,
      });
      const messageData = await fetchMessages({
        url: `/message?buildingNumber=${buildingNumber}&take=5`,
      });

      if (!data || !messageData) {
        push("/404");
        return;
      }

      setMessages(messageData);
      setBuilding(data);
    };

    getData();
  }, [buildingNumber]);

  const handleNewReport = useCallback(
    (data: any) => {
      const report = data.report as Report;

      if (building?.id !== report.buildingId) {
        setBuilding(buildingFromApi);
        return;
      }

      const copy = { ...building };
      copy.reports.splice(
        copy.reports.findIndex((r) => r.id === report.id),
        1,
        report
      );
      setBuilding(copy);
    },
    [building]
  );

  const handleNewMessage = useCallback(
    (data: any) => {
      const message = data.message as MessageFull;

      if (!message.buildings.some((b) => b.buildingId === building?.id)) {
        setMessages(messagesFromApi);
        return;
      }

      const copy = [...messages!];
      copy.push(message);
      setMessages(copy);
    },
    [building]
  );

  useEffect(() => {
    socket?.on("new_report", handleNewReport);
    socket?.on("new_message", handleNewMessage);
  }, [socket, handleNewReport, handleNewMessage]);

  const renderApartments = useCallback(() => {
    if (!building) return null;

    const sortedApartments = building.apartments.sort(
      (a, b) => a.number - b.number
    );

    return (
      <div>
        <h4>
          {translate.BuildingPage(buildingNumber as string).report}{" "}
          {translate.Globals.short_month_names[new Date().getMonth()]}{" "}
          {new Date().getFullYear()}
        </h4>
        {sortedApartments.map((apartment) => (
          <div
            key={apartment.id}
            css={{
              display: "flex",
              justifyContent: "space-between",
              padding: 10,
              borderBottom: "solid 1px lightgray",
              ":last-of-type": { paddingBottom: 0, border: "none" },
              ":hover .info-icon": {
                color: "coral",
              },
            }}
          >
            <div>
              <Popover
                content={<ApartmentInfo apartment={apartment} />}
                title={translate.Globals.information}
                trigger="click"
                placement="right"
              >
                <InfoCircleOutlined
                  className="info-icon"
                  css={{
                    cursor: "pointer",
                    transition: "all .5s",
                    marginRight: 5,
                    fontSize: "1.3em",
                  }}
                />
              </Popover>
              {translate.BuildingPage(buildingNumber as string).apartment}{" "}
              {apartment.number}
            </div>
            <div>
              {isApartmentTaxPaid(building, apartment.number) ? (
                <CheckCircleFilled css={{ color: "green" }} />
              ) : (
                <CloseCircleFilled css={{ color: "red" }} />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }, [building]);

  return (
    <div id="building-page">
      <Head>
        <title>
          {translate.BuildingPage(buildingNumber as string).meta_title}
        </title>
        <meta
          name="description"
          content={
            translate.BuildingPage(buildingNumber as string).meta_content
          }
        />
      </Head>

      <h1 css={{ textAlign: "center", margin: "20px 0px" }}>
        {translate.BuildingPage(buildingNumber as string).title}
      </h1>
      <div
        css={{
          display: "grid",
          gap: 10,
          height: "calc(100vh - 115px)",
          gridTemplateAreas: `
            "report admins prevMonthReport"
            "report news news"
          `,
          gridTemplateRows: "max-content 1fr",
          "@media (max-width: 778px)": {
            height: "auto",
            gridTemplateAreas: `
              "admins"
              "prevMonthReport"
              "news"
              "report"
            `,
            gridTemplateRows: "max-content 1fr max-content",
          },
        }}
      >
        <Tile css={{ gridArea: "admins" }}>
          {building?.users
            ?.filter((user) => user.user.type !== UserType.Guest)
            .map((user) => (
              <div key={user.id}>
                <b>{translate.Globals.user_types[user.user.type]}</b>:{" "}
                {user.user.name}
                {user.user.info ? ` (${user.user.info})` : null}
              </div>
            ))}
        </Tile>
        <Tile
          css={{
            gridArea: "prevMonthReport",
            display: "flex",
          }}
        >
          {building?.reports.findIndex(
            (r) =>
              r.date ===
              `${moment().subtract(1, "months").toDate().getFullYear()}-${
                moment().subtract(1, "months").toDate().getMonth() + 1
              }`
          )
            ? "TODO"
            : translate.BuildingPage(buildingNumber as string)
                .prevMonthReportNotReady}
        </Tile>
        <Tile css={{ gridArea: "report" }}>{renderApartments()}</Tile>
        <Tile css={{ gridArea: "news" }}>
          <h4>{translate.BuildingPage(buildingNumber as string).news}</h4>
          {messages ? (
            <Collapse ghost>
              {messages.map((message) => (
                <Collapse.Panel
                  header={
                    <div
                      css={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <span>{message.title}</span>
                      <span>{`${new Date(message.createdAt).getDate()}.${
                        new Date(message.createdAt).getMonth() + 1
                      }.${new Date(message.createdAt).getFullYear()}${
                        translate.Globals.year_short
                      }`}</span>
                    </div>
                  }
                  key={message.id}
                >
                  <div
                    css={{
                      padding: 5,
                      border: "1px solid lightgray",
                      borderRadius: 10,
                    }}
                  >
                    {parse(
                      DOMPurify.sanitize(message.content, {
                        USE_PROFILES: { html: true },
                      })
                    )}
                  </div>
                </Collapse.Panel>
              ))}
            </Collapse>
          ) : null}
        </Tile>
      </div>
    </div>
  );
};

export default withAuth(BuildingPage);
