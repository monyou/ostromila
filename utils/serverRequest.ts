import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import authorizeServerReq from "./serverAuth";

export type RequestHandler = Record<
  string,
  (prisma: PrismaClient) => Promise<void>
>;

const serverRequest = async (
  req: NextApiRequest,
  res: NextApiResponse,
  handler: RequestHandler,
  auth: boolean = false
): Promise<void> => {
  if (auth && !(await authorizeServerReq(req, res))) return;

  try {
    if (!handler[req.method!]) {
      res.status(405).json({
        Exception: "405",
        Success: false,
        Result: null,
      });
      return;
    }

    const prisma = new PrismaClient();
    await prisma.$connect();

    handler[req.method!](prisma);

    await prisma.$disconnect();
  } catch (error) {
    res.status(500).json({
      Exception: "500",
      Success: false,
      Result: null,
    });
  }
};

export default serverRequest;
