import type { ApiResponse } from "../../../utils/makeAjaxRequest";
import type { NextApiRequest, NextApiResponse } from "next";
import serverRequest, {
  type RequestHandler,
} from "../../../utils/serverRequest";
import { Apartment, Building, Report, UserType } from "@prisma/client";

export type BuildingWithApartmentsAndReports = Building & {
  apartments: Apartment[];
  reports: Report[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<BuildingWithApartmentsAndReports[]>>
) {
  const reqHandler = {
    GET: async (prisma) => {
      const buildings = await prisma.building.findMany({
        include: {
          apartments: true,
          reports: true,
        },
      });

      res.status(200).json({
        Exception: "",
        Success: true,
        Result: buildings,
      });
    },
  } as RequestHandler;

  await serverRequest(req, res, reqHandler, true, [
    UserType.HouseManager,
    UserType.Cashier,
  ]);
}
