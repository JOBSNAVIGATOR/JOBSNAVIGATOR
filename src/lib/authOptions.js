import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { compare } from "bcrypt";
import db from "./db";
// import { UserRole } from "@prisma/client";
export const authOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "uj@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // console.log("Authorize function recieved credentials:", credentials);
          // Check if user credentials are they are Not empty
          if (!credentials?.email || !credentials?.password) {
            throw { error: "No Inputs Found", status: 401 };
          }
          // console.log("Passed Check 1 ");
          //Check if user exists
          const existingUser = await db.user.findUnique({
            where: { email: credentials.email },
            include: {
              consultantProfile: {
                include: {
                  role: {
                    include: {
                      permissions: {
                        include: {
                          permission: true, // Fetch permission names
                        },
                      },
                    },
                  },
                },
              },
              candidateProfile: true, // Check if the user is a candidate
              clientProfile: true, // Check if the user is a client
            },
          });
          if (!existingUser) {
            // console.log("No user found");
            throw { error: "No user found", status: 401 };
          }

          // console.log("Passed Check 2");

          //Check if Password is correct
          const passwordMatch = await compare(
            credentials.password,
            existingUser.hashedPassword
          );
          if (!passwordMatch) {
            // console.log("Password incorrect");
            throw { error: "Password Incorrect", status: 401 };
          }
          // console.log("Pass 3 Checked");

          // Determine user type & set profile ID
          const profileType = existingUser?.consultantProfile?.role?.name || "";
          // console.log("profileType", profileType);

          const user = {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            emailVerified: existingUser.emailVerified,
            profileType, // Store the profile type (consultant, candidate, or client)
          };
          //
          // console.log("User Compiled");
          // console.log(user);
          //   this user is passed to callback function jwt
          return user;
        } catch (error) {
          // console.log("aLL Failed");
          // console.log(error);
          throw { error: "Something went wrong", status: 401 };
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        // console.log(`token:${token} in session`);
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        // session.user.image = token.picture;
        session.user.emailVerified = token.emailVerified;
        session.user.profileType = token.profileType; // Add profileType to session
      }
      // console.log(`session:${session.user}`);
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.emailVerified = user.emailVerified;
        token.profileType = user.profileType; // Add profileType to JWT
      }
      // console.log(`token:${token}`);
      //   this token is sent to session now
      return token;
    },
  },
};
