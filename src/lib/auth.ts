import axios from "axios";
import NextAuth from "next-auth";
import "next-auth/jwt";
import AzureADProvider from "next-auth/providers/microsoft-entra-id";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthResponse, JWTToken } from "src/types/auth";

export const generateAccessToken = async (
  refreshToken: string,
  scope: string
) => {
  try {
    const url = `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/oauth2/v2.0/token`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body:
        `grant_type=refresh_token` +
        `&client_secret=${process.env.AZURE_AD_CLIENT_SECRET}` +
        `&refresh_token=${refreshToken}` +
        `&client_id=${process.env.AZURE_AD_CLIENT_ID}` +
        `&scope=${scope}`,
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return refreshedTokens.access_token;
  } catch (error) {
    return {
      error: "RefreshAccessTokenError",
    };
  }
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  // debug: !!process.env.AUTH_DEBUG,
  debug: process.env.NODE_ENV === "development",
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID || "",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || "",
      issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0`,
      authorization: {
        params: {
          scope: "openid profile email offline_access user.read",
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
            id: response.data.result?.userId,
            email: response.data.result?.email,
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
        token.microsoftGraphToken = account.access_token as string;
        token.provider = account.provider;
        token.accessToken = await generateAccessToken(
          account.refresh_token,
          `api://ac08175c-4e88-4c68-b5fd-85dee723fe40/access_as_user`
        );
      }
      if (user && "provider" in user) {
        token.provider = user.provider;
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken as string;
      session.microsoftGraphToken = token.microsoftGraphToken as string;
      session.idToken = token.idToken as string;
      session.provider = token.provider as string;
      return session;
    },
  },
});
