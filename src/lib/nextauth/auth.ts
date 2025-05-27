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
          console.error("Missing credentials");
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
    async signIn({ account, user }) {
      console.log("at signIn", account);

      // For email and password sign-in
      if (account?.type === "credentials") {
        console.log("→ credentials login accepted");
        return true;
      }
      // For Google sign-in
      if (account?.id_token) {
        console.log("account", account);

        const response = true;
        console.log("response at auth/nextauth", response);

        return response;
      }
      // Return false if sign-in is not allowed
      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
      }
      console.log("JWT Token:", token);
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
      console.log("Session:", session);
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};
