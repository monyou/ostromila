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
import { Popover } from "antd";
import ApartmentInfo from "../../components/ApartmentInfo";
import withAuth from "../../utils/withAuth";

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
    query: { buildingNumber },
  } = useRouter();

  const [building, setBuilding] = useState<BuildingFull>();

  const { response: buildingFromApi, makeRequest: fetchBuilding } =
    useMakeAjaxRequest<BuildingFull>({
      lazy: true,
    });

  useEffect(() => {
    if (!Number(buildingNumber)) return;

    const getData = async () => {
      const data = await fetchBuilding({
        url: `/building?buildingNumber=${buildingNumber}`,
      });

      setBuilding(data!);
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

  useEffect(() => {
    socket?.on("new_report", handleNewReport);
  }, [socket, handleNewReport]);

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
              "report"
              "news"
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
                {translate.Globals.user_types[user.user.type]}: {user.user.name}
              </div>
            ))}
        </Tile>
        <Tile
          css={{
            gridArea: "prevMonthReport",
            display: "flex",
            alignItems: "center",
          }}
        >
          {
            translate.BuildingPage(buildingNumber as string)
              .prevMonthReportNotReady
          }
        </Tile>
        <Tile css={{ gridArea: "report" }}>{renderApartments()}</Tile>
        <Tile css={{ gridArea: "news" }}>
          {translate.BuildingPage(buildingNumber as string).news}
        </Tile>
      </div>
    </div>
  );
};

export default withAuth(BuildingPage);
