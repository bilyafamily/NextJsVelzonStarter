export interface JwtUser {
  id: string;
  unique_name: string;
  name: string;
  roles: string[];
}

export interface JWTToken {
  access_token?: string;
  roles?: string[];
  refresh_token?: string;
  [key: string]: unknown;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface RegisterDto {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ResetPasswordDto {
  token: string;
  email: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  statusCode: number;
  result: {
    token: string;
    expiresIn: string;
    userId: string;
    email: string;
    name: string;
  };
  isSuccess: boolean;
  message: string;
}

export type GraphUser = {
  "@odata.type": string;
  id: string;
  businessPhones: string[];
  displayName: string;
  givenName: string;
  jobTitle: string;
  mail: string;
  mobilePhone: string | null;
  officeLocation: string | null;
  preferredLanguage: string | null;
  surname: string;
  userPrincipalName: string;
  groupId?: string;
  role?: string;
};

export interface GroupMember extends GraphUser {
  groupId: string;
  groupType: GroupType;
}

type GroupType =
  | "administrator"
  | "coordinator"
  | "investigator"
  | "senior manager"
  | "reviewer";
