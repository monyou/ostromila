import type { MessageFull } from "./all";
import type { ApiResponse } from "../../../utils/makeAjaxRequest";
import type { NextApiRequest, NextApiResponse } from "next";
import { UserType } from "@prisma/client";
import serverRequest, {
  type RequestHandler,
} from "../../../utils/serverRequest";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<MessageFull>>
) {
  const reqHandler = {
    POST: async (prisma) => {
      const { buildings, ...messageData } = JSON.parse(req.body);

      const message = await prisma.message.create({
        data: {
          ...messageData,
          buildings: {
            createMany: {
              data: buildings.map((bId: string) => ({ buildingId: bId })),
            },
          },
        },
        include: {
          buildings: true,
          createdBy: true,
        },
      });

      //@ts-ignore
      res.socket?.server?.io?.emit("new_message", { message });
      res.status(200).json({
        Exception: "",
        Success: true,
        Result: message,
      });
    },
  } as RequestHandler;

  await serverRequest(req, res, reqHandler, true, [
    UserType.HouseManager,
    UserType.Cashier,
  ]);
}
