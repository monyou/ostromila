import type { ApiResponse } from "../../../utils/makeAjaxRequest";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  type Message,
  UserType,
  type MessageBuilding,
  type User,
} from "@prisma/client";
import serverRequest, {
  type RequestHandler,
} from "../../../utils/serverRequest";

export type MessageFull = Message & {
  buildings: MessageBuilding[];
  createdBy: User;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<MessageFull[]>>
) {
  const reqHandler = {
    GET: async (prisma) => {
      const messages = await prisma.message.findMany({
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

  await serverRequest(req, res, reqHandler, true, [
    UserType.HouseManager,
    UserType.Cashier,
  ]);
}
