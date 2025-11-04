import { CreateUserInput, UpdateUserDto } from "../../dtos/user.dto";
import * as userModel from "../../models/user/user.model";
import bcrypt from "bcryptjs";
import { ApiError } from "../apiError";

export const listUsers = async () => {
    return userModel.getAllUsers();
}

export const getUserProfile = async (id: number) => {
    const user = await userModel.getUserById(id);
    if (!user) {
        throw ApiError.notFound("User not found");
    }
    return user;
}

export const registerUser = async (data: CreateUserInput) => {
    return userModel.registerUser(data);
}

export const updateUser = async (id: number, data: UpdateUserDto) => {
    const user = await userModel.getUserById(id);
    if (!user) {
        throw ApiError.notFound("User not found");
    }
    return userModel.updateUser(id, data);
}

// Reset password แบบ logged in (EditProfile)
export const changePassword = async (
    userId: number,
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
) => {
    // ตรวจสอบ newPassword กับ confirmNewPassword
    if (newPassword !== confirmNewPassword) {
        throw ApiError.conflict("New password and confirm password do not match");
    }

    const user = await userModel.getUserById(userId);
    console.log("user id", user?.password);

    if (!user) throw ApiError.notFound("User not found");

    // ตรวจสอบ current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) throw ApiError.badRequest("Current password is incorrect");

    // hash password ใหม่

    // อัปเดต password ใน DB
    return userModel.updatePassword(userId, newPassword);
};

export const deleteUser = async (id: number) => {
    const user = await userModel.getUserById(id);
    if (!user) {
        throw ApiError.notFound("User not found");
    }
    return userModel.deleteUser(id);
}

