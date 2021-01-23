import React from "react";
import { GetStaticProps } from "next";
import Layout from "../components/Layout";
import prisma from "../lib/prisma";
import { User } from "@prisma/client";
import UserComponent from "../components/User";

export const getStaticProps: GetStaticProps = async () => {
  const users = await prisma.user.findMany();

  return { props: { users }, revalidate: 60 };
};

type Props = {
  users: User[];
};

const Blog: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page">
        <h1>List of Users</h1>
        <main>
          {props.users.map((user) => (
            <div key={user.id}>
              <UserComponent user={user} />
            </div>
          ))}
        </main>
      </div>
    </Layout>
  );
};

export default Blog;
