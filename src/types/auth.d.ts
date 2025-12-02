export interface JwtUser {
  id: string;
  unique_name: string;
  name: string;
  roles: string[];
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
