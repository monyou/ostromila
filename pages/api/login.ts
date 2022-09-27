import type { ApiResponse } from "../../utils/makeAjaxRequest";
import type { NextApiRequest, NextApiResponse } from "next";
import serverRequest, { type RequestHandler } from "../../utils/serverRequest";
import type { UserType } from "@prisma/client";

export type LoggedUser = {
  id: string;
  type: UserType;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<LoggedUser | null>>
) {
  const reqHandler = {
    POST: async (prisma) => {
      const { username, password } = JSON.parse(req.body);

      const user = await prisma.user.findFirst({
        where: {
          username,
          password,
        },
        select: {
          id: true,
          type: true,
        },
      });

      if (user) {
        res.status(200).json({
          Exception: "",
          Success: true,
          Result: user,
        });
      } else {
        res.status(404).json({
          Exception: "691",
          Success: false,
          Result: null,
        });
      }
    },
  } as RequestHandler;

  await serverRequest(req, res, reqHandler);
}
