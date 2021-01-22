import React from "react";
import { GetStaticProps } from "next";
import ReactMarkdown from "react-markdown";
import Layout from "../../components/Layout";
import prisma from "../../lib/prisma";
import { useSession } from "next-auth/client";
import Router, { useRouter } from "next/router";
import { User } from "@prisma/client";

export async function getStaticPaths() {
  const users = await prisma.user.findMany();

  const paths = users.map((user) => `/user/${user.id}`);

  return { paths, fallback: true };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(params?.id) || -1,
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

const UserPage: React.FC<User> = (props) => {
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
        <h2>{props.name}</h2>
      </div>
    </Layout>
  );
};

export default UserPage;
