import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import generateSession from "../../../../services/authentication/generate_session";
import { NextResponse } from "next/server";
import { ref, update } from "firebase/database";
import { database } from "../../../../../firebaseMain";
import generateSessionGoogle from "@/services/authentication/generate_session_google";
//
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    ///--------------------------------------------------------
    // Sign In
    ///--------------------------------------------------------
    async signIn({ account }) {
      if (account?.id_token) {
        // Return true to indicate successful sign-in
        return true;
      }
      // Return false if sign-in is not allowed
      return false;
    },

    ///--------------------------------------------------------
    // Generate a session
    ///--------------------------------------------------------
    async session({ token, user }) {
      const session = await generateSessionGoogle(token, user);
      //--------------------------------------------------------------------------------
      // Store the session
      //--------------------------------------------------------------------------------
      (async () => {
        const dbRef = ref(database, `session/${session.user}`);
        update(dbRef, { session });
        //--------------------------------------------------------------------------------
        // Store the sessionId
        //--------------------------------------------------------------------------------
        const dbRef2 = ref(database, `sessionId/${session.sessionId}`);
        update(dbRef2, { sessionPlate: session.sessionPlate });
        //--------------------------------------------------------------------------------
      })();
      //
      return {
        ...session,
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Set an expiration date
        user: {
          name: session.user || null,
        },
      };
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
