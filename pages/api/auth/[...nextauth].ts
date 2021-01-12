import { NextApiHandler } from "next";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";
import prisma from "../../../lib/prisma";

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

const options = {
  debug: true,
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // authorizationUrl:
      //   "https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code",
    }),
  ],
  adapter: Adapters.Prisma.Adapter({ prisma }),
  // secret: process.env.SECRET,
  // callbacks: {
  //   signIn: async (user, account, profile) => {
  //     if (
  //       account.provider === "google" &&
  //       profile.verified_email === true &&
  //       profile.email.endsWith("@nerdery.com")
  //     ) {
  //       return Promise.resolve(true);
  //     } else {
  //       return Promise.resolve(false);
  //     }
  //   },
  // },
};
