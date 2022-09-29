import type { NextPage } from "next";
import Head from "next/head";
import useGlobalContext from "../../contexts/global";
import withAuth from "../../utils/withAuth";
import { Button, Collapse, Popover, Select, Switch, DatePicker } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import useMakeAjaxRequest from "../../utils/makeAjaxRequest";
import type { BuildingWithApartmentsAndReports } from "../api/building/all";
import { useCallback, useEffect, useMemo, useState } from "react";
import { type Report, UserType } from "@prisma/client";
import moment from "moment";
import isApartmentTaxPaid from "../../utils/isApartmentTaxPaid";
import ApartmentInfo from "../../components/ApartmentInfo";

const { Panel } = Collapse;
const { Option } = Select;

const AdminPage: NextPage = () => {
  const {
    state: { translate },
  } = useGlobalContext();

  useEffect(() => {
    moment.updateLocale("en", {
      monthsShort: translate.Globals.short_month_names,
    });
  }, [translate]);

  const [buildings, setBuildings] = useState<
    BuildingWithApartmentsAndReports[]
  >([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>();
  const [period, setPeriod] = useState<Date | null>(new Date());
  const building = useMemo(
    () =>
      buildings.find((building) => building.id === selectedBuildingId) ||
      ({} as BuildingWithApartmentsAndReports),
    [buildings, selectedBuildingId]
  );

  const { response: buildingsFromApi } = useMakeAjaxRequest<
    BuildingWithApartmentsAndReports[]
  >({
    url: "/building/all",
  });
  const { makeRequest: createReport } = useMakeAjaxRequest<Report>({
    url: "/report/create",
    lazy: true,
    params: { method: "post" },
  });
  const { makeRequest: updateReport } = useMakeAjaxRequest<Report>({
    url: "/report/update",
    lazy: true,
    params: { method: "put" },
  });

  useEffect(() => {
    setBuildings(buildingsFromApi || []);
  }, [buildingsFromApi]);

  const updateReportHandler = async (
    value: boolean,
    reportDate: string,
    apartmentNumber: number
  ): Promise<void> => {
    const buildingsCopy = [...buildings];
    const buildingCopy = { ...building };
    const buildingAparmentsCopy = [...buildingCopy.apartments];
    const buildingReportsCopy = [...buildingCopy.reports];
    const buildingReport = buildingReportsCopy.find(
      (report) => report.date === reportDate
    );

    if (buildingReport) {
      const buildingReportData = JSON.parse(
        buildingReport.reportData?.toString()!
      );
      buildingReportData[apartmentNumber] = value;
      buildingReport.reportData = JSON.stringify(buildingReportData);
      const updatedReport = await updateReport({
        params: { body: JSON.stringify(buildingReport) },
      });

      if (!updatedReport) return;

      buildingReportsCopy.splice(
        buildingReportsCopy.findIndex(
          (report) => report.id === updatedReport.id
        ),
        1,
        updatedReport
      );
      buildingCopy.reports = buildingReportsCopy;
      buildingsCopy.splice(
        buildingsCopy.findIndex((building) => building.id === buildingCopy.id),
        1,
        buildingCopy
      );
      setBuildings(buildingsCopy);
    } else {
      const report = JSON.stringify({
        buildingId: building.id,
        date: reportDate,
        reportData: JSON.stringify(
          buildingAparmentsCopy.reduce((acc, value) => {
            const newAcc = { ...acc } as Record<string, boolean>;
            newAcc[value.number.toString()] = value.number === apartmentNumber;
            return newAcc;
          }, {} as Record<string, boolean>)
        ),
      } as Report);
      const newReport = await createReport({ params: { body: report } });

      if (!newReport) return;

      buildingReportsCopy.push(newReport);
      buildingCopy.reports = buildingReportsCopy;
      buildingsCopy.splice(
        buildingsCopy.findIndex((building) => building.id === buildingCopy.id),
        1,
        buildingCopy
      );
      setBuildings(buildingsCopy);
    }
  };

  const handleReportCreation = async (
    type: "monthly" | "yearly"
  ): Promise<void> => {
    //TODO
  };

  const renderApartments = useCallback(() => {
    if (!Object.keys(building).length || !period) return null;

    const sortedApartments = building.apartments.sort(
      (a, b) => a.number - b.number
    );

    return (
      <div
        css={{
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
          justifyContent: "center",
        }}
      >
        {sortedApartments.map((apartment) => (
          <div
            key={apartment.id}
            css={{
              display: "flex",
              width: 96,
              flexDirection: "column",
              alignItems: "center",
              gap: 5,
              transition: "all .5s",
              cursor: "pointer",
              ":hover": {
                transform: "scale(1.3,1.3)",
              },
              ":hover .apartment": {
                color: "coral",
              },
            }}
          >
            <Popover
              content={<ApartmentInfo apartment={apartment} />}
              title={translate.Globals.information}
              trigger="click"
            >
              <div
                className="apartment"
                css={{
                  cursor: "pointer",
                  transition: "all .5s",
                }}
              >
                {translate.AdminPage.apartment_title(apartment.number)}
              </div>
            </Popover>
            <div>{translate.AdminPage.tax_title(apartment.tax)}</div>
            <Switch
              checkedChildren={translate.AdminPage.paid}
              unCheckedChildren={translate.AdminPage.unpaid}
              checked={isApartmentTaxPaid(building, apartment.number, period)}
              onChange={(value) =>
                updateReportHandler(
                  value,
                  `${period.getFullYear()}-${period.getMonth() + 1}`,
                  apartment.number
                )
              }
            />
          </div>
        ))}
      </div>
    );
  }, [building, period]);

  return (
    <div id="admin-page">
      <Head>
        <title>{translate.AdminPage.meta_title}</title>
        <meta name="description" content={translate.AdminPage.meta_content} />
      </Head>

      <h1 css={{ textAlign: "center", marginTop: 20 }}>
        {translate.AdminPage.title}
      </h1>

      <div
        css={{
          display: "flex",
          justifyContent: "center",
          "@media (max-width:460px)": {
            flexDirection: "column",
            alignItems: "center",
          },
          margin: "20px 0px",
        }}
      >
        <Select
          css={{
            width: 144,
            marginRight: 4,
            "@media (max-width:460px)": {
              marginRight: 0,
              marginBottom: 4,
            },
          }}
          bordered={false}
          onChange={(value) => setSelectedBuildingId(value)}
          placeholder={translate.AdminPage.pick_building}
        >
          {buildings?.map((building) => (
            <Option key={building.id} value={building.id}>
              {building.number}
            </Option>
          ))}
        </Select>
        <DatePicker
          bordered={false}
          css={{
            width: 160,
          }}
          value={period ? moment(period) : null}
          onChange={(value) => setPeriod(value ? value.toDate() : null)}
          placeholder={translate.AdminPage.pick_month}
          picker="month"
        />
      </div>

      <Collapse ghost>
        <Panel header={translate.AdminPage.panel.title1} key="1">
          {renderApartments()}
        </Panel>
        <Panel header={translate.AdminPage.panel.title2} key="2">
          {period ? (
            <>
              <Button
                css={{ marginBottom: 16, display: "block" }}
                type="primary"
                icon={<FilePdfOutlined />}
                onClick={() => handleReportCreation("monthly")}
              >
                {translate.AdminPage.reports.monthly_btn}
              </Button>
              <Button
                css={{ display: "block" }}
                type="primary"
                icon={<FilePdfOutlined />}
                onClick={() => handleReportCreation("yearly")}
              >
                {translate.AdminPage.reports.yearly_btn}
              </Button>
            </>
          ) : null}
        </Panel>
        <Panel header={translate.AdminPage.panel.title3} key="3">
          Тест
        </Panel>
      </Collapse>
    </div>
  );
};

export default withAuth(AdminPage, [UserType.HouseManager, UserType.Cashier]);
