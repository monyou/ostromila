import type { ApiResponse } from "../../utils/makeAjaxRequest";
import type { NextApiRequest, NextApiResponse } from "next";
import serverRequest, { type RequestHandler } from "../../utils/serverRequest";
import type { UserType } from "@prisma/client";
import jwt from "jsonwebtoken";

export type LoggedUser = {
  id: string;
  type: UserType;
  token: string;
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
        const token = jwt.sign(
          { id: user.id, username, password, type: user.type },
          process.env.NEXT_PUBLIC_AUTH_TOKEN_SECRET!
        );
        res.status(200).json({
          Exception: "",
          Success: true,
          Result: { ...user, token },
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
