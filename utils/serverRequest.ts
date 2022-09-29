import { PrismaClient, type UserType } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import authorizeServerReq from "./serverAuth";

export type RequestHandler = Record<
  string,
  (prisma: PrismaClient) => Promise<void>
>;

export let prisma: PrismaClient | null = null;

const serverRequest = async (
  req: NextApiRequest,
  res: NextApiResponse,
  handler: RequestHandler,
  auth: boolean = false,
  roles: UserType[] | null = null
): Promise<void> => {
  if (auth && !(await authorizeServerReq(req, res, roles))) return;

  try {
    if (!handler[req.method!]) {
      res.status(405).json({
        Exception: "405",
        Success: false,
        Result: null,
      });
      return;
    }

    if (req.method === "OPTIONS") {
      res.status(200).send("ok");
      return;
    }

    if (!prisma) {
      prisma = new PrismaClient();
    }

    await handler[req.method!](prisma);
  } catch (error) {
    res.status(500).json({
      Exception: "500",
      Success: false,
      Result: null,
    });
  }
};

export default serverRequest;
