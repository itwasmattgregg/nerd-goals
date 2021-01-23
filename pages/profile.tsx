import React, { useState } from "react";
import Layout from "../components/Layout";
import Router from "next/router";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { GetStaticProps } from "next";
import prisma from "../lib/prisma";
import { User } from "@prisma/client";

interface Values {
  name: string;
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
    props: { user },
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
