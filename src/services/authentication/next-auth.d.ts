import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    firebaseToken?: string;
    accessToken?: string;
    error?: string;
    user: {
      id: string;
    } & DefaultSession["user"];
    sessionId?: string & DefaultSession["session"];
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
}
