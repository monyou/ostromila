import type { ApiResponse } from "../../utils/makeAjaxRequest";
import type { NextApiRequest, NextApiResponse } from "next";
import serverRequest, { type RequestHandler } from "../../utils/serverRequest";

export type LoggedUser = {
  _id?: string;
  name?: string;
  username?: string;
  type?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<LoggedUser>>
) {
  const reqHandler = {
    POST: async (prisma) => {
      const { username, password } = JSON.parse(req.body);

      const admin = await prisma.admin.findFirst({
        where: {
          username,
          password,
        },
        select: {
          id: true,
          name: true,
          username: true,
          type: true,
        },
      });

      if (admin) {
        res.status(200).json({
          Exception: "",
          Success: true,
          Result: admin,
        });
      } else {
        res.status(404).json({
          Exception: "691",
          Success: false,
          Result: {},
        });
      }
    },
  } as RequestHandler;

  await serverRequest(req, res, reqHandler);
}
