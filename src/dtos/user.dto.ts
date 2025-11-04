import { UserRole } from "./roles.dto";

export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
    confirmPassword: string; 
  }
  
  export interface CreateUserInput {
    name: string;
    email: string;
    password: string;
  }
  
export interface UpdateUserDto {
    name?: string;
    email?: string;
}

export interface changePasswordDto {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}
export interface UserResponseDto {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}
