import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { adminDB } from "../../../firebase-admin";
import CredentialsProvider from "next-auth/providers/credentials";
import callHub from "@/services/api/call_hub";

// Session cache to reduce Firebase operations
const sessionCache = new Map<string, { data: object; expires: number }>();

// Clear expired sessions every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of sessionCache.entries()) {
    if (value.expires < now) {
      sessionCache.delete(key);
    }
  }
}, 5 * 60 * 1000);

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
    // Sign In - Optimized for faster Google login
    ///--------------------------------------------------------
    async signIn({ account, user }) {
      // For email and password sign-in
      if (account?.type === "credentials") {
        return true;
      }
      // For Google sign-in - streamlined validation
      if (account?.provider === "google" && account?.access_token) {
        // Cache successful Google logins to reduce repeated validations
        const cacheKey = `google_${user?.email}`;
        const cached = sessionCache.get(cacheKey);
        
        if (cached && cached.expires > Date.now()) {
          return true;
        }
        
        // Cache successful login for 10 minutes
        sessionCache.set(cacheKey, {
          data: { userId: user?.id, email: user?.email },
          expires: Date.now() + 10 * 60 * 1000
        });
        
        return true;
      }
      // Return false if sign-in is not allowed
      return false;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      
      // Add account info for faster subsequent requests
      if (account?.provider === "google") {
        token.provider = "google";
        token.fastAuth = true;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub ?? "";
          session.user.name = token.name ?? "";
          session.user.email = token.email ?? "";
          //##Note: typescript definition was extended on next-auth.d.ts file.
          //Module augmentation
        }
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes
  },
  // Optimize session storage
  pages: {
    signIn: '/',
  },
};
