import { useMutation } from "@tanstack/react-query";
import { apiClient } from "src/lib/api";
import { ChangePasswordDto, LoginDto, RegisterDto } from "src/types/auth";
import { ResponseDto } from "src/types/common";

export const useRegister = () => {
  return useMutation({
    mutationFn: (userData: RegisterDto) => authService.register(userData),
    onError: (error: Error) => {
      console.error("Registration error:", error.message);
    },
  });
};

export const authService = {
  async login(data: LoginDto): Promise<any> {
    const response = await apiClient.post("/auth/Login", data);
    return response;
  },

  async register(userData: RegisterDto): Promise<any> {
    const response = await apiClient.post("/auth/register", userData);
    return response;
  },

  async forgotPassword(email: string): Promise<any> {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response;
  },

  async resetPassword(
    token: string,
    email: string,
    newPassword: string
  ): Promise<any> {
    const response = await apiClient.post("/auth/reset-password", {
      token,
      email,
      newPassword,
    });
    return response;
  },

  async verifyResetToken(token: string, email: string): Promise<boolean> {
    const response = await apiClient.get<ResponseDto>(
      `/auth/verify-reset-token?token=${token}&email=${encodeURIComponent(email)}`
    );
    return response.result.isValid;
  },

  async verifyEmail(token: string): Promise<any> {
    const response = await apiClient.post("/auth/VerifyEmail", { token });
    return response;
  },

  async updateProfile(data: any): Promise<any> {
    const response = await apiClient.put("/auth/UpdateProfile", data);
    return response;
  },
};

export const changePassword = async (data: ChangePasswordDto) => {
  const response = await apiClient.post<ResponseDto>(
    "/auth/change-password",
    data
  );
  return response;
};
