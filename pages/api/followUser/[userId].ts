import prisma from "../../../lib/prisma";
import { getSession } from "next-auth/client";

// POST /api/followUser/:userId?follow=true
// GET /api/followUser/:userId
export default async function handle(req, res) {
  const userId = req.query.userId;
  const follow: string = req.query.follow;

  if (req.method === "POST") {
    if (follow === undefined) {
      res.status(500).send("Missing required param");
      return;
    }
    const session = await getSession({ req });
    // TODO: check if user is trying to follow themselves

    const connect = { connect: [{ id: userId }] };
    const disconnect = { disconnect: [{ id: userId }] };

    const post = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        following: follow === "true" ? connect : disconnect,
      },
      include: {
        following: true,
      },
    });
    res.json(post);
  } else if (req.method === "GET") {
    const userId = req.query.userId;
  } else {
    res.status(500).send("Server error");
  }
}
