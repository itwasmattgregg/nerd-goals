import React from "react";
import Layout from "../components/Layout";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { GetServerSideProps } from "next";
import prisma from "../lib/prisma";
import { User } from "@prisma/client";
import { getSession } from "next-auth/client";

interface Values {
  name: string;
}
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

type Props = {
  user: User;
};

const Profile: React.FC<Props> = ({ user }) => {
  // const submitData = async (e: React.SyntheticEvent) => {
  //   e.preventDefault();
  //   try {
  //     const body = { title, content };
  //     await fetch("/api/post", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(body),
  //     });
  //     await Router.push("/drafts");
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <Layout>
      <div>
        <Formik
          initialValues={{
            name: user.name,
          }}
          validate={(values) => {
            const errors = {};

            // if (!values.email) {
            //   errors.email = "Required";
            // } else if (
            //   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            // ) {
            //   errors.email = "Invalid email address";
            // }

            return errors;
          }}
          onSubmit={(
            values: Values,
            { setSubmitting }: FormikHelpers<Values>
          ) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 500);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <label htmlFor="name">Name</label>
              <Field id="name" name="name" placeholder="John" />

              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  );
};

export default Profile;
