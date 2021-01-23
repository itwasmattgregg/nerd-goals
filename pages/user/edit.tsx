import React from "react";
import Layout from "../../components/Layout";
import prisma from "../../lib/prisma";
import { getSession } from "next-auth/client";
import { GetServerSideProps } from "next";
import { UserProps } from "../../components/User";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { user: null } };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.userId,
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
