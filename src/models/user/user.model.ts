import {  CreateUserInput, UpdateUserDto } from "../../dtos/user.dto";
import prisma from "../index";
import bcrypt from "bcryptjs";

export const getAllUsers = () => {
    return prisma.user.findMany({
      include: {
        cart: true,
        orders: true,
      },
    });
  };


export const getUserByEmail = (email: string) => {
    return prisma.user.findUnique({
        where: {email}
    })
}

export const getUserById = (id: number) => {
    return prisma.user.findUnique({
        where: {id},
        include: {
            cart: true,
            orders: true,
        }
    })
}

export const registerUser = (data: CreateUserInput) => {
    return prisma.user.create({
        data
    })
}

export const updateUser = (id: number, data: UpdateUserDto) => {
    return prisma.user.update({
        where: {id},
        data
    })
}

export const updatePassword = async (userId: number, newPassword: string) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  });
}

export const deleteUser = (id: number) => {
    return prisma.user.delete({
        where: {id}
    })
}