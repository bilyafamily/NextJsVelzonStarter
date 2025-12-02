import axios from "axios";
import NextAuth from "next-auth";
import "next-auth/jwt";
import AzureADProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthResponse } from "src/types/auth";
import { ResponseDto } from "src/types/common";

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: !!process.env.AUTH_DEBUG,
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID || "",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || "",
      issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0`,
      authorization: {
        params: {
          scope: "openid profile email offline_access",
        },
      },
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
        try {
          const response = await axios.post<AuthResponse>(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          if (!response.data || response.status !== 200) {
            return null;
          }

          return {
            id: response.data.result.userId,
            email: response.data.result.email,
            name: response.data.result.name || response.data.result.email,
            provider: "credentials",
            accessToken: response.data.result.token,
          };
        } catch (error) {
          console.error("[AUTH] Credentials provider error:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, account, user }: any) {
      if (account) {
        token.idToken = account.id_token as string;
        token.accessToken = account.access_token as string;
        token.provider = account.provider;
      }
      if (user && "provider" in user) {
        token.provider = user.provider;
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken as string;
      session.idToken = token.idToken as string;
      session.provider = token.provider as string;
      return session;
    },
  },
});
