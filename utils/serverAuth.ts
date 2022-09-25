import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const authorizeServerReq = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<boolean> => {
  try {
    const { username, password } = JSON.parse(
      req.headers.authorization as string
    );
    const prisma = new PrismaClient();
    await prisma.$connect();
    const user = await prisma.admin.findFirst({
      where: {
        username,
        password,
      },
    });
    await prisma.$disconnect();

    if (!user) {
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
