import type { ApiResponse } from "../../../utils/makeAjaxRequest";
import type { NextApiRequest, NextApiResponse } from "next";
import type {
  Admin,
  AdminBuilding,
  Apartment,
  Building,
  Report,
} from "@prisma/client";
import serverRequest, {
  type RequestHandler,
} from "../../../utils/serverRequest";

export type BuildingFull = Building & {
  apartments: Apartment[];
  reports: Report[];
  admins: (AdminBuilding & { admin: Admin })[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<BuildingFull>>
) {
  const reqHandler = {
    GET: async (prisma) => {
      const { buildingNumber } = req.query;
      const building = (await prisma.building.findFirst({
        where: {
          number: Number(buildingNumber),
        },
        include: {
          apartments: true,
          reports: true,
          admins: {
            include: {
              admin: true,
            },
          },
        },
      })) as BuildingFull;

      res.status(200).json({
        Exception: "",
        Success: true,
        Result: building,
      });
    },
  } as RequestHandler;

  await serverRequest(req, res, reqHandler);
}
