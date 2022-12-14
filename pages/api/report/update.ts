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
    PUT: async (prisma) => {
      const { id, ...reportData } = JSON.parse(req.body);
      const report = await prisma.report.update({
        where: {
          id,
        },
        data: reportData,
      });

      //@ts-ignore
      res.socket?.server?.io?.emit("new_report", { report });
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
