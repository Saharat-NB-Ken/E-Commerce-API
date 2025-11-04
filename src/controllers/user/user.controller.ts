import { Request, Response, NextFunction } from "express";
import * as userService from "../../utils/service/user.service";
import { UserResponseDto } from "../../dtos/user.dto";
import { UserRole } from "../../dtos/roles.dto";
import { ApiError } from "../../utils/apiError";
import { getIdFromHeader } from "../../middlewares/auth";
import { changePasswordSchema } from "../../validator/user.joi";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.listUsers();
    const response: UserResponseDto[] = users.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as UserRole,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));
    res.json(response);
  } catch (error) {
    next(error);
  }
}

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getIdFromHeader(req);
    const user = await userService.getUserProfile(userId);
    if (!user) {
      return new ApiError(404, "User not found!")
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser = await userService.registerUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const updatedUser = await userService.updateUser(userId, req.body);
    if (!updatedUser) {
      return new ApiError(404, "User not found!")
    }
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
}

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getIdFromHeader(req);
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const { error } = changePasswordSchema.validate(
      { currentPassword, newPassword, confirmNewPassword },
      { abortEarly: false }
    );

    if (error) {
      const messages = error.details.map((d) => d.message);
      throw ApiError.badRequest(messages.join(", "));
    }
    await userService.changePassword(userId, currentPassword, newPassword, confirmNewPassword);

    res.json({ message: "Password changed successfully" });
  } catch (error: any) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const deletedUser = await userService.deleteUser(userId);
    if (!deletedUser) {
      return new ApiError(404, "User not found!")
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}


