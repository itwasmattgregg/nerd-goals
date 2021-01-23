import React from "react";
import { GetStaticProps } from "next";
import Layout from "../../components/Layout";
import prisma from "../../lib/prisma";
import { useSession } from "next-auth/client";
import Router, { useRouter } from "next/router";
import { User } from "@prisma/client";
import { UserProps } from "../../components/User";

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
    include: {
      technologies: {
        select: { name: true },
      },
      goals: {
        select: {
          title: true,
          createdAt: true,
          achieved: true,
          achievedAt: true,
          updatedAt: true,
        },
      },
    },
  });
  return {
    props: user,
  };
};

const UserPage: React.FC<UserProps> = (props) => {
  const [session, loading] = useSession();
  // if (loading) {
  //   return <div>Authenticating ...</div>;
  // }
  const router = useRouter();
  if (router.isFallback) {
    // This is only really displayed if the page has NEVER been fetched before
    return <div>Loading...</div>;
  }
  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.email;

  return (
    <Layout>
      <div>
        <h1>{props.name}</h1>
        <p>Goal: {props.broadGoal}</p>
        <p>{props.email}</p>
        <p>{props.timeToLearn}</p>
        <ul>
          {props.technologies.map((tech) => (
            <li>{tech.name}</li>
          ))}
        </ul>
        <ul>
          {props.goals.map((goal) => (
            <li>
              {goal.title} | {goal.createdAt} | {goal.achieved} |{" "}
              {goal.achievedAt}
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default UserPage;
