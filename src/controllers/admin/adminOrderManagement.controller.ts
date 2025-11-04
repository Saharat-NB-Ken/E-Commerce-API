import { Request, Response, NextFunction } from "express";
import * as orderService from "../../services/admin/adminOrderManagement.service";
import { OrderStatus } from "@prisma/client";

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = 1,
      limit = 10,
      orderBy = "createdAt",
      orderDirection = "desc",
      status,
      isDeleted,
      userId,
      dateFrom,
      dateTo,
      period,
    } = req.query;

    const result = await orderService.getOrders(
      Number(page),
      Number(limit),
      orderBy as string,
      orderDirection as "asc" | "desc",
      {
        status: status as any,
        isDeleted: isDeleted !== undefined ? isDeleted === "true" : undefined,
        userId: userId ? Number(userId) : undefined,
        dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
        dateTo: dateTo ? new Date(dateTo as string) : undefined,
      },
      period as "day" | "month" | "year" | undefined
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
};


export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const order = await orderService.getOrderById(id);
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updated = await orderService.updateOrderStatus(id, status as OrderStatus);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const softDeleteOrderController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await orderService.softDeleteOrder(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const restoreOrderController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const restored = await orderService.restoreOrder(id);
    res.json(restored);
  } catch (err) {
    next(err);
  }
};
