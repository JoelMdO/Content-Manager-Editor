import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { adminDB } from "../../services/db/firebase-admin";
import CredentialsProvider from "next-auth/providers/credentials";
import callHub from "@/services/api/call_hub";
import refreshGoogleAccessToken from "@/services/authentication/refresh_token";

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
        token.accessTokenExpires =
          Date.now() + Number(account.expires_in ?? 3600) * 1000;
      }

      if (user) {
        token.sub = user.id;
        token.name = user.name;
      }

      // Return existing token if still valid (or if no expiration set)
      if (
        !token.accessTokenExpires ||
        Date.now() < (token.accessTokenExpires as number)
      ) {
        return token;
      }

      // Token expired and we have a refresh token → try to refresh
      if (token.refreshToken) {
        return await refreshGoogleAccessToken(token);
      }

      // No refresh token available, return as-is (will have error flag from refresh attempt)
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
        // Add accessToken to session so it can be used by API calls
        (session as any).accessToken = token.accessToken;
        // Check if token has refresh error
        if (token.error) {
          (session as any).error = token.error;
        }
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    // The maximum age of the NextAuth.js issued JWT in seconds
    maxAge: 60 * 60 * 1, // 1 hour
  },
};
