import type { ApiResponse } from "../../../utils/makeAjaxRequest";
import type { NextApiRequest, NextApiResponse } from "next";
import { Report, UserType } from "@prisma/client";
import serverRequest, {
  type RequestHandler,
} from "../../../utils/serverRequest";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Report>>
) {
  const reqHandler = {
    POST: async (prisma) => {
      const reportData = JSON.parse(req.body);
      const report = await prisma.report.create({
        data: reportData,
      });

      res.status(200).json({
        Exception: "",
        Success: true,
        Result: report,
      });
    },
  } as RequestHandler;

  await serverRequest(req, res, reqHandler, true, [
    UserType.HouseManager,
    UserType.Cashier,
  ]);
}
