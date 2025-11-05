import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import { CreateUserDto } from "../dtos/user.dto";
import * as emailService from "../utils/service/email.service";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.registerUser(req.body as CreateUserDto);
    console.log("user", user.name);

    emailService.sendUserSignupEmail('kenza555plus@gmail.com', user.name);
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const tokenData = await authService.loginUser(email, password);
    res.json(tokenData);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const token = await emailService.sendResetEmail(email);
    res.json({ message: "Password reset link sent to your email", token });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = req.body;
    const user = await authService.resetPassword(token, newPassword);
    res.json({ message: "Password has been reset successfully", user });
  } catch (error) {
    next(error);
  }
};

