import prisma from "../index";
import { OrderStatus, Prisma } from "@prisma/client";
import { getStartDate } from "./adminDashboard.model";

export const getAllOrders = async (
  skip: number,
  take: number,
  orderBy: string,
  orderDirection: "asc" | "desc",
  filters?: {
    status?: OrderStatus;
    isDeleted?: boolean;
    userId?: number;
    dateFrom?: Date;
    dateTo?: Date;
  },
  period?: "day" | "month" | "year"
) => {
  const startDate = getStartDate(period);

  return prisma.order.findMany({
    skip,
    take,
    orderBy: { [orderBy]: orderDirection },
    where: {
      ...(filters?.status ? { status: filters.status } : {}),
      ...(filters?.isDeleted !== undefined ? { isDeleted: filters.isDeleted } : {}),
      ...(filters?.dateFrom || filters?.dateTo
        ? {
            createdAt: {
              ...(filters.dateFrom ? { gte: filters.dateFrom } : {}),
              ...(filters.dateTo ? { lte: filters.dateTo } : {}),
            },
          }
        : startDate
        ? { createdAt: { gte: startDate } }
        : {}),
    },
    include: {
      user: true,
      items: { include: { product: true } },
      payment: true,
    },
  });
};


export const countOrders = async (
  filters?: {
    status?: OrderStatus;
    isDeleted?: boolean;
    userId?: number;
    dateFrom?: Date;
    dateTo?: Date;
  },
  period?: "day" | "month" | "year"
) => {
  const startDate = getStartDate(period);

  return prisma.order.count({
    where: {
      ...(filters?.status ? { status: filters.status } : {}),
      ...(filters?.isDeleted !== undefined ? { isDeleted: filters.isDeleted } : {}),
      ...(filters?.userId ? { userId: filters.userId } : {}),
      ...(filters?.dateFrom || filters?.dateTo
        ? {
            createdAt: {
              ...(filters.dateFrom ? { gte: filters.dateFrom } : {}),
              ...(filters.dateTo ? { lte: filters.dateTo } : {}),
            },
          }
        : startDate
        ? { createdAt: { gte: startDate } }
        : {}),
    },
  });
};


export const getOrderById = async (id: number) => {
  return prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
      payment: true,
    },
  });
};


export const updateOrderStatus = async (id: number, status: OrderStatus) => {
  return prisma.order.update({
    where: { id },
    data: { status },
    include: {
      items: true,
      payment: true,
    },
  });
};

export const softDeleteOrder = async (orderId: number) => {
  return prisma.order.update({
    where: { id: orderId },
    data: { isDeleted: true, deletedAt: new Date() },
  });
};

export const restoreOrder = async (orderId: number) => {
  return prisma.order.update({
    where: { id: orderId },
    data: { isDeleted: false, deletedAt: null },
  });
};