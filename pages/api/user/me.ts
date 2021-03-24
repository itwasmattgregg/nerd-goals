import prisma from "../../../lib/prisma";
import { getSession } from "next-auth/client";
import { UserWithSkillsAndGoals } from "../../profile";

// PUT /api/user/me
export default async function handle(req, res) {
  if (req.method === "PUT") {
    const { name, broadGoal }: UserWithSkillsAndGoals = req.body;

    const session = await getSession({ req });

    const post = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        broadGoal,
      },
    });
    res.json(post);
  } else {
    res.status(404).send("Not found");
  }
}
