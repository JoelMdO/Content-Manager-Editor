import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { adminDB } from "../../../firebase-admin";
import CredentialsProvider from "next-auth/providers/credentials";
import callHub from "@/services/api/call_hub";

///--------------------------------------------------------
// Authentication Options to be used on server side
///--------------------------------------------------------
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        //
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const email = credentials?.email;
        const password = credentials?.password;
        const response = await callHub("sign-in-by-email", { email, password });

        if (response.status !== 200) {
          return null;
        }

        if (response.status === 200) {
          // Return a user object as required by NextAuth
          return {
            id: "id",
            name: "name",
            email: "email",
            // Add any other properties as needed
          };
        }

        return null;
      },
    }),
  ],
  adapter: FirestoreAdapter(adminDB),
  callbacks: {
    ///--------------------------------------------------------
    // Sign In
    ///--------------------------------------------------------
    async signIn({ account }) {
      // For email and password sign-in
      if (account?.type === "credentials") {
        return true;
      }
      // For Google sign-in
      if (account?.id_token) {
        const response = true;

        return response;
      }
      // Return false if sign-in is not allowed
      return false;
    },
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }

      if (user) {
        token.sub = user.id;
        token.name = user.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub ?? "";
          session.user.name = token.name ?? "";
          //##Note: typescript definition was extended on next-auth.d.ts file.
          //Module augmentation
        }
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  // jwt: { //TODO remove on production and change to 1 hr.
  //   // The maximum age of the NextAuth.js issued JWT in seconds
  //   maxAge: 60 * 60 * 24 * 30, // 30 days
  // },
};
