// hooks/auth.hooks.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService, changePassword } from "@/services/auth.service";
import {
  ChangePasswordDto,
  RegisterDto,
  LoginDto,
  ResetPasswordDto,
} from "src/types/auth";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { toast } from "react-toastify";
import { auth } from "src/lib/auth";

// Query keys for better cache management
export const authKeys = {
  all: ["auth"] as const,
  currentUser: () => [...authKeys.all, "currentUser"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
};

export const getAuthHeaders = async () => {
  const session = await auth();
  return {
    "Content-Type": "application/json",
    ...(session?.accessToken && {
      Authorization: `Bearer ${session.accessToken}`,
    }),
  };
};

export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: RegisterDto) => authService.register(userData),
    onSuccess: data => {
      // Invalidate user queries
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });

      // Optionally auto-login after registration
      // router.push('/auth/login?registered=true');
    },
    onError: (error: Error) => {
      console.error("Registration error:", error.message);
      // You can add toast notifications here
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginDto) => {
      // First authenticate with your API
      const data = await authService.login(credentials);

      // Then sign in with NextAuth
      const result = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return data;
    },
    onSuccess: data => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
      // router.push('/dashboard');
    },
    onError: (error: Error) => {
      console.error("Login error:", error.message);
    },
  });
};

export const useChangePassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ChangePasswordDto) => changePassword(data),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
      return { success: true, message: "Password changed successfully" };
    },
    onError: (error: any) => {
      let errorMessage = "Failed to change password";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = "Current password is incorrect";
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid request. Please check your input.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Return error to be used in component
      return { error: errorMessage, status: error.response?.status };
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await signOut({ redirect: false });
    },
    onSuccess: () => {
      queryClient.clear();
      router.push("/auth/login");
    },
    onError: (error: Error) => {
      console.error("Logout error:", error.message);
      router.push("/auth/login");
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onError: (error: Error) => {
      console.error("Forgot password error:", error.message);
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => authService.updateProfile(data),
    onSuccess: () => {
      // Invalidate user profile queries
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
    },
    onError: (error: Error) => {
      console.error("Update profile error:", error.message);
    },
  });
};

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordDto) =>
      authService.resetPassword(data.token, data.email, data.newPassword),
    onSuccess: data => {
      toast.success(
        data.message ||
          "Password reset successfully! You can now login with your new password."
      );
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to reset password. Please try again.";
      toast.error(errorMessage);
    },
  });
}
