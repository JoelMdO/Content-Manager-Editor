import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
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
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        // Use a server-side fetch to the internal login route instead of
        // importing client-side helpers at module initialization. Dynamic or
        // client imports can cause the NextAuth API route to fail to load
        // and return 404 in some environments.
        const loginUrl = `${process.env.NEXTAUTH_URL}/api/auth/login`;
        const raw = await fetch(loginUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });
        const json = await raw.json();
        if (raw.status !== 200) return null;
        const user = json as { id: string; email: string; name?: string };
        return {
          id: String(user.id),
          email: user.email,
          name: user.name || user.email,
        };
      },
    }),
  ],
  //TODO add db support previous was adapter: FirebaseAdapter(adminDB),
  callbacks: {
    ///--------------------------------------------------------
    // Sign In
    ///--------------------------------------------------------
    async signIn({ user, account }) {
      // Upsert user in Django on every sign-in (idempotent)
      if (account?.type === "credentials" || account?.id_token) {
        const provider = account.id_token ? "google" : "credentials";
        await fetch(`${process.env.NEXTAUTH_URL}/api/auth/users/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            provider,
          }),
        });
        return true;
      }
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
        session.accessToken = token.accessToken;
        // Check if token has refresh error
        if (token.error) {
          session.error = token.error;
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
