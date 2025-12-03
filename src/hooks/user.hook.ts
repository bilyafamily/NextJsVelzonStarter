import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import {
  UserDto,
  CreateUserDto,
  UpdateUserDto,
  ResetPasswordDto,
  RoleDto,
} from "@/types/user";
import { toast } from "react-toastify";
import { ResponseDto } from "src/types/common";

// Query keys
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: any) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  roles: ["roles"] as const,
};

// User queries
export function useGetUsers() {
  return useQuery<UserDto[], Error>({
    queryKey: userKeys.lists(),
    queryFn: () => userService.getUsers(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useGetUserById(userId: string) {
  return useQuery<UserDto, Error>({
    queryKey: userKeys.detail(userId),
    queryFn: () => userService.getUserById(userId),
    enabled: !!userId,
  });
}

export function useGetRoles() {
  return useQuery<RoleDto[], Error>({
    queryKey: userKeys.roles,
    queryFn: () => userService.getRoles(),
    staleTime: 5 * 60 * 1000,
  });
}

// User mutations
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation<ResponseDto, Error, CreateUserDto>({
    mutationFn: (data: CreateUserDto) => userService.createUser(data),
    onSuccess: response => {
      console.log("reseponse", response);
      if (response.isSuccess) {
        queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        toast.success("User created successfully");
      } else {
        toast.error(response.message);
      }
    },
    onError: error => {
      toast.error(`Failed to create user: ${error.message}`);
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation<UserDto, Error, { userId: string; data: UpdateUserDto }>({
    mutationFn: ({ userId, data }) => userService.updateUser(userId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.userId),
      });
      toast.success("User updated successfully");
    },
    onError: error => {
      toast.error(`Failed to update user: ${error.message}`);
    },
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation<UserDto, Error, { userId: string; isActive: boolean }>({
    mutationFn: ({ userId, isActive }) =>
      userService.toggleUserStatus(userId, isActive),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.userId),
      });
      toast.success(
        `User ${variables.isActive ? "enabled" : "disabled"} successfully`
      );
    },
    onError: error => {
      toast.error(`Failed to update user status: ${error.message}`);
    },
  });
}

export function useResetPassword() {
  return useMutation<void, Error, ResetPasswordDto>({
    mutationFn: userService.resetPassword,
    onSuccess: () => {
      toast.success("Password reset successfully");
    },
    onError: error => {
      toast.error(`Failed to reset password: ${error.message}`);
    },
  });
}

// Role mutations
export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation<RoleDto, Error, string>({
    mutationFn: userService.createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.roles });
      toast.success("Role created successfully");
    },
    onError: error => {
      toast.error(`Failed to create role: ${error.message}`);
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: userService.deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.roles });
      toast.success("Role deleted successfully");
    },
    onError: error => {
      toast.error(`Failed to delete role: ${error.message}`);
    },
  });
}

export function useAssignRole() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { userId: string; roleName: string }>({
    mutationFn: ({ userId, roleName }) =>
      userService.assignRoleToUser(userId, roleName),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.userId),
      });
      toast.success("Role assigned successfully");
    },
    onError: error => {
      toast.error(`Failed to assign role: ${error.message}`);
    },
  });
}

export function useRemoveRole() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { userId: string; roleName: string }>({
    mutationFn: ({ userId, roleName }) =>
      userService.removeRoleFromUser(userId, roleName),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.userId),
      });
      toast.success("Role removed successfully");
    },
    onError: error => {
      toast.error(`Failed to remove role: ${error.message}`);
    },
  });
}
