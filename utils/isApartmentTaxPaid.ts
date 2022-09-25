import type { BuildingWithApartmentsAndReports } from "../pages/api/building/all";
import type { BuildingFull } from "./../pages/api/building/index";

const isApartmentTaxPaid = (
  building: BuildingFull | BuildingWithApartmentsAndReports,
  apartmentNumber: number,
  period: Date = new Date()
): boolean => {
  const report = building.reports.find(
    (report) =>
      report.date === `${period.getFullYear()}-${period.getMonth() + 1}`
  );
  const reportData = JSON.parse(report?.reportData?.toString() || "{}");

  return reportData?.[apartmentNumber.toString()] || false;
};

export default isApartmentTaxPaid;
