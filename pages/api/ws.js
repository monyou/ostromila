import { Server } from "socket.io";

export default async function handler(req, res) {
  if (res.socket.server.io) return res.end();

  const io = new Server(res.socket.server, {
    cors: { origin: "*" },
  });

  res.socket.server.io = io;

  return res.end();
}
