import type { ApiResponse } from "../../utils/makeAjaxRequest";
import type { NextApiRequest, NextApiResponse } from "next";
import serverRequest, { type RequestHandler } from "../../utils/serverRequest";
import type { UserType } from "@prisma/client";

export type LoggedUser = {
  id: string;
  type: UserType;
  token: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<any>>
) {
  const reqHandler = {
    GET: async () => {
      res.status(200).json({
        Exception: "",
        Success: true,
        Result: { message: "Server is running" },
      });
    },
  } as RequestHandler;

  await serverRequest(req, res, reqHandler);
}
