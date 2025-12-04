import { CredentialsToken, DecodedIdToken } from "src/types/auth";
import { jwtDecode, JwtPayload } from "jwt-decode";

export const decodeIdToken = (idToken: string): DecodedIdToken | null => {
  try {
    if (!idToken) return null;
    return jwtDecode<DecodedIdToken>(idToken);
  } catch (error) {
    console.error("Failed to decode ID token:", error);
    return null;
  }
};

export const extractRolesFromToken = (idToken: string): string[] => {
  const decodedToken = decodeIdToken(idToken);
  if (!decodedToken) return [];

  const roles = decodedToken.roles || [];

  return Array.isArray(roles) ? roles : [roles];
};

export const decodeCredentialsToken = (
  token: string
): CredentialsToken | null => {
  try {
    if (!token) return null;
    return jwtDecode<CredentialsToken>(token);
  } catch (error) {
    console.error("Failed to decode ID token:", error);
    return null;
  }
};

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

export const refreshAuthToken = async (token: any): Promise<any> => {
  try {
    // Only refresh if using Azure AD provider and token is expired
    if (token.provider !== "microsoft-entra-id" || !token.refreshToken) {
      return token;
    }
    // Check if token is expired (with 30 second buffer)
    const decoded = decodeIdToken(token.idToken);
    const expiryTime = decoded?.exp ? decoded.exp * 1000 : 0;
    const now = Date.now();

    if (expiryTime > now - 30000) {
      // Token is still valid, no need to refresh
      return token;
    }

    console.log("Refreshing expired token...");

    const url = `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/oauth2/v2.0/token`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: process.env.AZURE_AD_CLIENT_ID || "",
        client_secret: process.env.AZURE_AD_CLIENT_SECRET || "",
        refresh_token: token.refreshToken,
        scope: "openid profile email offline_access user.read",
      }).toString(),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      console.error("Token refresh failed:", refreshedTokens);
      throw new Error("RefreshTokenError");
    }

    return {
      ...token,
      idToken: refreshedTokens.id_token,
      microsoftGraphToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token || token.refreshToken,
      accessToken: refreshedTokens.access_token,
      expiresAt:
        Math.floor(Date.now() / 1000) + (refreshedTokens.expires_in || 3600),
    };
  } catch (error) {
    console.error("Token refresh failed:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
};
