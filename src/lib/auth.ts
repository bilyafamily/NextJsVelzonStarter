import axios from "axios";
import NextAuth from "next-auth";
import "next-auth/jwt";
import AzureADProvider from "next-auth/providers/microsoft-entra-id";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthResponse } from "src/types/auth";
import {
  decodeCredentialsToken,
  extractRolesFromToken,
  generateAccessToken,
  refreshAuthToken,
} from "./token";

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
    async jwt({ token, account, user, trigger, session }: any) {
      if (account) {
        token.idToken = account.id_token as string;
        token.microsoftGraphToken = account.access_token as string;
        token.provider = account.provider;
        token.accessToken = await generateAccessToken(
          account.refresh_token,
          `api://ad420d35-72c0-464e-a4f4-ee63a0ff4a7a/access_as_user`
        );

        // Extract roles from ID token for Azure AD
        if (account.id_token) {
          const roles = extractRolesFromToken(account.id_token);
          token.roles = roles;
        }
      }

      if (user && account && !account.id_token) {
        var decodedToken = decodeCredentialsToken(user.accessToken);
        token.roles =
          decodedToken?.[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];
      }

      // For credentials provider, get roles from user object
      if (user && user.provider === "credentials" && user?.roles) {
        token.roles = user.roles;
      }

      if (user && "provider" in user) {
        token.provider = user.provider;
        token.accessToken = (user as any).accessToken;
      }

      // Handle session updates (if you want to update token from session)
      if (trigger === "update" && session?.roles) {
        token.roles = session.roles;
      }

      // Check and refresh token if needed
      const shouldRefresh =
        token.provider !== "credentials" &&
        token.expiresAt &&
        Date.now() >= token.expiresAt * 1000 - 30000; // 30 seconds buffer

      if (shouldRefresh) {
        console.log("Token expired or about to expire, refreshing...");
        const refreshedToken = await refreshAuthToken(account.refresh_token);
        return refreshedToken;
      }

      return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken as string;
      session.microsoftGraphToken = token.microsoftGraphToken as string;
      session.idToken = token.idToken as string;
      session.provider = token.provider as string;
      session.user.roles = token?.roles || [];
      return session;
    },
    // async redirect({ url, baseUrl }) {
    //   // Allows relative callback URLs
    //   if (url.startsWith("/")) return `${baseUrl}${url}`;
    //   // Allows callback URLs on the same origin
    //   else if (new URL(url).origin === baseUrl) return url;
    //   return baseUrl;
    // },
  },
});
