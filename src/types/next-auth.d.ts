import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    microsoftGraphToken?: string;
    idToken?: string;
    provider?: string;
    user: {
      // id: string;
      // email?: string | null;
      // name?: string | null;
      // image?: string | null;
      role: string[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    provider?: string;
    accessToken?: string;
    idToken?: string;
    microsoftGraphToken?: string;
  }
}
