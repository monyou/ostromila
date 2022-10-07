import type { NextPage } from "next";
import Head from "next/head";
import useGlobalContext from "../../contexts/global";
import withAuth, { getCookie } from "../../utils/withAuth";
import {
  Button,
  Collapse,
  Popover,
  Select,
  Switch,
  DatePicker,
  Input,
  Form,
  type FormInstance,
} from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import useMakeAjaxRequest from "../../utils/makeAjaxRequest";
import type { BuildingWithApartmentsAndReports } from "../api/building/all";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type Report, UserType, type Message } from "@prisma/client";
import moment from "moment";
import isApartmentTaxPaid from "../../utils/isApartmentTaxPaid";
import ApartmentInfo from "../../components/ApartmentInfo";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { AUTH_TOKEN } from "../_app";
import jwt from "jsonwebtoken";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const { Panel } = Collapse;
const { Option } = Select;

const AdminPage: NextPage = () => {
  const {
    state: { translate },
  } = useGlobalContext();

  const [buildings, setBuildings] = useState<
    BuildingWithApartmentsAndReports[]
  >([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>();
  const [period, setPeriod] = useState<Date | null>(new Date());
  const newMessageFormRef = useRef<FormInstance>(null);
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
  const { makeRequest: createMessage } = useMakeAjaxRequest<Message>({
    url: "/message/create",
    lazy: true,
    params: {
      method: "post",
    },
  });

  useEffect(() => {
    moment.updateLocale("en", {
      monthsShort: translate.Globals.short_month_names,
    });
  }, [translate]);

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

  const handleSubmitNewMessage = async (values: {
    buildings: string[];
    title: string;
    content: string;
  }): Promise<void> => {
    const { id: userId } = jwt.verify(
      getCookie(AUTH_TOKEN!)!,
      process.env.NEXT_PUBLIC_AUTH_TOKEN_SECRET!
    ) as { id: string };

    const body = {
      ...values,
      createdById: userId,
    };

    const result = await createMessage({
      params: { body: JSON.stringify(body) },
    });

    toast(
      result
        ? translate.AdminPage.news.success_msg
        : translate.AdminPage.news.error_msg,
      { type: result ? "success" : "error" }
    );

    newMessageFormRef.current?.resetFields();
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

      <Collapse ghost>
        <Panel header={translate.AdminPage.panel.title1} key="1">
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
          <div>
            <h3 css={{ marginBottom: 20 }}>Създаване на новина</h3>
            <Form
              ref={newMessageFormRef}
              name="new-message-form"
              onFinish={handleSubmitNewMessage}
              autoComplete="off"
            >
              <Form.Item
                name="buildings"
                rules={[
                  {
                    required: true,
                    message: translate.AdminPage.news.errors.buildings,
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  allowClear
                  placeholder={translate.AdminPage.news.placeholders.buildings}
                >
                  {buildings?.map((building) => (
                    <Option key={`news-${building.id}`} value={building.id}>
                      {building.number}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="title"
                rules={[
                  {
                    required: true,
                    message: translate.AdminPage.news.errors.title,
                  },
                ]}
              >
                <Input
                  placeholder={translate.AdminPage.news.placeholders.title}
                />
              </Form.Item>

              <Form.Item
                name="content"
                rules={[
                  {
                    required: true,
                    message: translate.AdminPage.news.errors.content,
                  },
                ]}
              >
                <ReactQuill
                  theme="snow"
                  modules={{
                    toolbar: [
                      [{ size: [] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ align: [] }, { indent: "-1" }, { indent: "+1" }],
                      [{ color: [] }, { background: [] }],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link"],
                      ["clean"],
                    ],
                  }}
                  placeholder={translate.AdminPage.news.placeholders.content}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {translate.AdminPage.news.submit}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

export default withAuth(AdminPage, [UserType.HouseManager, UserType.Cashier]);
