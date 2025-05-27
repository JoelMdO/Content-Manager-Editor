import "server-only";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { adminDB } from "../../../../../firebase-admin";
import generateSessionGoogle from "@/services/authentication/generate_session_google";
import { authOptions } from "../../../../lib/nextauth/auth";
//
// export const authOptions = {
//   ...baseOptions,
//   adapter: FirestoreAdapter(adminDB),
//   callbacks: {
//     ...baseOptions.callbacks,
//     async jwt({ token, user }: { token: any; user?: any }) {
//       if (user && !token.sessionId) {
//         const sessionGoogle = await generateSessionGoogle(token, user);
//         token.sessionId = sessionGoogle.sessionId;
//       }
//       return token;
//     },
//   },
// };
// export const authOptions: NextAuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],
//   adapter: FirestoreAdapter(adminDB),
//   callbacks: {
//     ///--------------------------------------------------------
//     // Sign In
//     ///--------------------------------------------------------
//     async signIn({ account, user }) {
//       console.log("at signIn", account);

//       if (account?.id_token) {
//         console.log("account", account);

//         const response = true;
//         console.log("response at auth/nextauth", response);

//         return response;
//       }
//       // Return false if sign-in is not allowed
//       return false;
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         token.sub = user.id;
//       }
//       // Only on first sign-in, generate a sessionId from token and user
//       if (!token.sessionId) {
//         const sessionGoogle = await generateSessionGoogle(token, user);
//         token.sessionId = sessionGoogle.sessionId;
//       }
//       console.log("JWT Token:", token);
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         if (token.sub) {
//           session.user.id = token.sub ?? "";
//           //##Note: typescript definition was extended on next-auth.d.ts file.
//           //Module augmentation
//         }
//       }
//       // Add sessionId to the session object
//       const sessionId = token.sessionId;
//       // Pass it to the client
//       session.sessionId = sessionId;
//       console.log("Session:", session);
//       return session;
//     },
//   },
//   session: {
//     strategy: "jwt",
//   },
// };

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
