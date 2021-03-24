import React from "react";
import Layout from "../components/Layout";
import { Field, FieldArray, Form, Formik, FormikHelpers } from "formik";
import { GetServerSideProps } from "next";
import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";
import { getSession } from "next-auth/client";
import { useToasts } from "react-toast-notifications";

export const userInclude = {
  skills: {
    select: {
      proficiency: true,
      skill: {
        select: {
          id: true,
          name: true,
          displayName: true,
        },
      },
    },
  },
  goals: {
    select: {
      id: true,
      title: true,
      createdAt: true,
      achieved: true,
      achievedAt: true,
      updatedAt: true,
    },
  },
};

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
      skills: {
        select: {
          proficiency: true,
          skill: {
            select: {
              id: true,
              name: true,
              displayName: true,
            },
          },
        },
      },
      goals: {
        select: {
          id: true,
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

export type UserWithSkillsAndGoals = Prisma.UserGetPayload<{
  include: typeof userInclude;
}>;

type Props = {
  user: UserWithSkillsAndGoals;
};

const Profile: React.FC<Props> = ({ user }) => {
  const { addToast } = useToasts();

  const submitData = async (body: Partial<UserWithSkillsAndGoals>) => {
    try {
      const res = await fetch("/api/user/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error("Unsuccessful");
      }
      addToast("Saved successfully", { appearance: "success" });
    } catch (error) {
      console.error(error);
      addToast("Error saving", { appearance: "error" });
    }
  };

  return (
    <Layout>
      <div>
        <Formik
          initialValues={{
            name: user.name,
            broadGoal: user.broadGoal,
            skills: user.skills,
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
          onSubmit={async (
            values: Partial<UserWithSkillsAndGoals>,
            { setSubmitting }: FormikHelpers<Partial<UserWithSkillsAndGoals>>
          ) => {
            await submitData(values);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, values }) => (
            <Form>
              <label htmlFor="name">Name</label>
              <Field id="name" name="name" placeholder="Your name" required />
              <label htmlFor="broadGoal">Current broad goal</label>
              <Field
                id="broadGoal"
                name="broadGoal"
                placeholder="Current broad career goal"
                required
              />
              {/* Maybe break this part out into a component */}
              <h2>Skills</h2>
              <FieldArray
                name="skills"
                render={({ remove, push }) => (
                  <div>
                    {values.skills.map((skill, index) => (
                      <div key={index}>
                        <label htmlFor={`skills.${index}.name`}>Name</label>
                        <Field component="select" name={`skills.${index}.name`}>
                          <option value="dads">Dads</option>

                          <option value="javascript">JS</option>

                          <option value="CH">Chicago</option>

                          <option value="OTHER">Other</option>
                        </Field>

                        <button type="button" onClick={() => remove(index)}>
                          remove
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => push({ name: "" })}>
                      Add a skill
                    </button>
                  </div>
                )}
              />

              <button type="submit" disabled={isSubmitting}>
                {!isSubmitting ? "Submit" : "Saving"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  );
};

export default Profile;
