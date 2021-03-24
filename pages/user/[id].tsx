import React from "react";
import { GetStaticProps } from "next";
import Layout from "../../components/Layout";
import prisma from "../../lib/prisma";
import { useRouter } from "next/router";
import { userInclude, UserWithSkillsAndGoals } from "../profile";

// This is for a user's page right after account creation before the
// static asset has been generated.
export async function getStaticPaths() {
  const users = await prisma.user.findMany();
  const paths = users.map((user) => `/user/${user.id}`);
  return { paths, fallback: true };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const user = await prisma.user.findUnique({
    where: {
      id: params?.id.toString(),
    },
    include: userInclude,
  });
  return {
    props: user,
  };
};

const UserPage: React.FC<UserWithSkillsAndGoals> = (user) => {
  // const [session, loading] = useSession();
  // if (loading) {
  //   return <div>Authenticating ...</div>;
  // }
  // const userHasValidSession = Boolean(session);
  // const postBelongsToUser = session?.user?.email === props.email;
  const router = useRouter();
  if (router.isFallback) {
    // This is only really displayed if the page has NEVER been fetched before
    return <div>Loading...</div>;
  }

  const followUser = async (follow: boolean) => {
    try {
      const res = await fetch(`/api/followUser/${user.id}?follow=${follow}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw new Error("There was an error with the follow user endpoint.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div>
        <h1>{user.name}</h1>
        <p>Goal: {user.broadGoal}</p>
        <p>{user.email}</p>
        <p>{user.timeToLearn}</p>
        Skills:
        <ul>
          {user.skills.map(({ skill }) => (
            <li key={skill.id}>{skill.name}</li>
          ))}
        </ul>
        Goals:
        <ul>
          {user.goals.map((goal) => (
            <li key={goal.id}>
              {goal.title} | {goal.createdAt.toString()} | {goal.achieved} |{" "}
              {goal.achievedAt?.toString()}
            </li>
          ))}
        </ul>
      </div>
      <button type="button" onClick={() => followUser(true)}>
        Follow
      </button>
    </Layout>
  );
};

export default UserPage;
