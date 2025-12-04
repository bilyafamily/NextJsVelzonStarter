export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber?: string;
  isActive: boolean;
  emailConfirmed: boolean;
  createdAt: string;
  roles: string[];
}

export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  password: string;
  confirmPassword: string;
  roles: string[];
}

export interface UpdateUserDto {
  userId: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  isActive?: boolean;
  password?: string;
}

export interface ResetPasswordDto {
  userId: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AssignRoleDto {
  userId: string;
  roleName: string;
}

export interface RoleDto {
  name: string;
  userCount?: number;
}
