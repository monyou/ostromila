import { UserType } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { prisma } from "./serverRequest";

const authorizeServerReq = async (
  req: NextApiRequest,
  res: NextApiResponse,
  roles: UserType[] | null
): Promise<boolean> => {
  try {
    const token = req.cookies[process.env.NEXT_PUBLIC_AUTH_USER_COOKIE_TOKEN!];
    const { username, password } = jwt.verify(
      token!,
      process.env.NEXT_PUBLIC_AUTH_TOKEN_SECRET!
    ) as { username: string; password: string };

    const user = await prisma.user.findFirst({
      where: {
        username,
        password,
      },
    });

    if (!user || (roles && !roles.includes(user.type))) {
      res.status(403).json({
        Exception: "403",
        Success: false,
        Result: null,
      });
      return false;
    }

    return true;
  } catch (error) {
    res.status(403).json({
      Exception: "403",
      Success: false,
      Result: null,
    });
    return false;
  }
};

export default authorizeServerReq;
