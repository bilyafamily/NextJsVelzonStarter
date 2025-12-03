import {
  CreateUserDto,
  UpdateUserDto,
  ResetPasswordDto,
  UserDto,
  RoleDto,
} from "@/types/user";
import { apiClient } from "src/lib/api";
import { ResponseDto } from "src/types/common";

export const userService = {
  async getUsers(): Promise<UserDto[]> {
    const response = await apiClient.get<ResponseDto>(
      "/users/registered/users"
    );
    return response.result;
  },

  async getUserById(userId: string): Promise<UserDto> {
    const response = await apiClient.get<ResponseDto>(
      `/users/registered/users/${userId}`
    );
    return response.result;
  },

  async createUser(data: CreateUserDto): Promise<ResponseDto> {
    const response = await apiClient.post<any>(
      "/users/registered/users/create",
      data
    );
    return response;
  },

  async updateUser(userId: string, data: UpdateUserDto): Promise<UserDto> {
    const response = await apiClient.put<ResponseDto>(
      `/users/registered/users/${userId}`,
      data
    );
    return response.result;
  },

  async toggleUserStatus(userId: string, isActive: boolean): Promise<UserDto> {
    const response = await apiClient.patch<ResponseDto>(
      `/users/registered/users/${userId}/status`,
      {
        isActive,
        userId,
      }
    );
    return response.result;
  },

  async resetPassword(data: ResetPasswordDto): Promise<void> {
    await apiClient.post<ResponseDto>(
      "/users/registered/users/reset-password",
      data
    );
  },

  // Role Management
  async getRoles(): Promise<RoleDto[]> {
    const response = await apiClient.get<ResponseDto>("/roles/all");
    return response.result;
  },

  async createRole(roleName: string): Promise<RoleDto> {
    const response = await apiClient.post<ResponseDto>("/roles/create", {
      roleName,
    });
    return response.result;
  },

  async deleteRole(roleName: string): Promise<void> {
    await apiClient.delete(`/roles/${roleName}`);
  },

  async assignRoleToUser(userId: string, roleName: string): Promise<void> {
    await apiClient.post("/roles/assign", {
      userId,
      roleName,
    });
  },

  async removeRoleFromUser(userId: string, roleName: string): Promise<void> {
    await apiClient.post("/roles/remove", {
      userId,
      roleName,
    });
  },

  async getUserRoles(userId: string) {
    const response = await apiClient.get<ResponseDto>(`/roles/user/${userId}`);
    return response;
  },
};
