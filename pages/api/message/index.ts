import type { MessageFull } from "./all";
import type { ApiResponse } from "../../../utils/makeAjaxRequest";
import type { NextApiRequest, NextApiResponse } from "next";
import serverRequest, {
  type RequestHandler,
} from "../../../utils/serverRequest";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<MessageFull[]>>
) {
  const reqHandler = {
    GET: async (prisma) => {
      const { buildingNumber } = req.query;
      const messages = await prisma.message.findMany({
        where: {
          buildings: {
            some: {
              building: {
                number: Number(buildingNumber),
              },
            },
          },
        },
        include: {
          buildings: true,
          createdBy: true,
        },
      });

      res.status(200).json({
        Exception: "",
        Success: true,
        Result: messages,
      });
    },
  } as RequestHandler;

  await serverRequest(req, res, reqHandler, true);
}
