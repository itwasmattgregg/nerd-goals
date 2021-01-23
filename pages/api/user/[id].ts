import prisma from "../../../lib/prisma";
import { getSession } from "next-auth/client";

// PUT /api/user/:id
export default async function handle(req, res) {
  const { name } = req.body;
  const userId: string = req.query.id;

  const session = await getSession({ req });
  // TODO: Check if session id is same as user id

  const post = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
    },
  });
  res.json(post);
}
