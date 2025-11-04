import prisma from "../models/index";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as userService from "../utils/service/user.service";
import { CreateUserDto, CreateUserInput, UserResponseDto } from "../dtos/user.dto";
import * as userModel from "../models/user/user.model";
import { ApiError } from "../utils/apiError";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your_refresh_secret";

export const registerUser = async (data: CreateUserDto) => {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) {
    throw ApiError.badRequest("Email already exists");
  }

  if (data.password !== data.confirmPassword) {
    throw ApiError.conflict("Password and confirm password do not match");
  }
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user: CreateUserInput = {
    name: data.name,
    email: data.email,
    password: hashedPassword,
  };
  const result = await userService.registerUser(user);

  return result;
};

export const loginUser = async (email: string, password: string) => {
  console.log("111111");
  const user = await prisma.user.findUnique({ where: { email } });
  console.log("user:", user);

  if (!user) {
    //Not found error
    console.log("32323232");

    throw ApiError.notFound("User not found!");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    console.log("222222");
    throw ApiError.badRequest("Password is incorrect");
  }

  const token = jwt.sign({ id: user.id, role: user.role, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: "1d" });
  const refreshToken = jwt.sign(
    { id: user.id, role: user.role },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
  return {
    token,
    refreshToken,
  };
};

export const resetPassword = async (token: string, newPassword: string) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
  const user = await userModel.updatePassword(decoded.userId, newPassword);
  if (!user) throw ApiError.notFound("User not found");
  return user;

}

