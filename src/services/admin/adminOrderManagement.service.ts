import * as orderModel from "../../models/admin/adminOrderManagement.model";
import { OrderStatus } from "@prisma/client";
import { ApiError } from "../../utils/apiError";

export const getOrders = async (
  page: number = 1,
  limit: number = 10,
  orderBy: string = "createdAt",
  orderDirection: "asc" | "desc" = "desc",
  filters?: {
    status?: OrderStatus;
    isDeleted?: boolean;
    userId?: number;
    dateFrom?: Date;
    dateTo?: Date;
  },
  period?: "day" | "month" | "year"
) => {
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    orderModel.getAllOrders(skip, limit, orderBy, orderDirection, filters, period),
    orderModel.countOrders(filters, period),
  ]);

  return {
    data: orders,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      orderBy,
      orderDirection,
      ...filters,
      period: period || null,
    },
  };
};


export const getOrderById = async (id: number) => {
  const order = await orderModel.getOrderById(id);
  if (!order) throw ApiError.notFound("Order not found");
  return order;
};

export const updateOrderStatus = async (id: number, status: OrderStatus) => {
  const order = await orderModel.getOrderById(id);
  if (!order) throw ApiError.notFound("Order not found");
  return orderModel.updateOrderStatus(id, status);
};

export const softDeleteOrder = async (id: number) => {
  const order = await orderModel.getOrderById(id);
  if (!order) throw ApiError.notFound("Order not found");
  return orderModel.softDeleteOrder(id);
};

export const restoreOrder = async (id: number) => {
  const order = await orderModel.getOrderById(id);
  if (!order) throw ApiError.notFound("Order not found");
  return orderModel.restoreOrder(id);
};