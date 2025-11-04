import { Request, Response } from "express";
import { changeStatusToCompleted, createOrder as createOrderService, getUserOrders as getUserOrdersService } from "../../services/user/order.service";
import { getIdFromHeader } from "../../middlewares/auth";
import { getPaginationParams } from "../../utils/query";

export const createOrderController = async (req: Request, res: Response) => {
  try {
    const userId = getIdFromHeader(req)
    console.log("userId", userId);

    const items = req.body;
    const order = await createOrderService(userId, items);
    res.status(201).json(order);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const getUserOrdersController = async (req: Request, res: Response) => {
  try {
    const userId = getIdFromHeader(req)
    const { page, limit } = getPaginationParams(req.query);
    const orders = await getUserOrdersService(userId, page, limit);
    res.status(200).json(orders);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const changeStatusToCompletedController = async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.params.orderId)
    const order = await changeStatusToCompleted(orderId);
    res.status(200).json(order)
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message });

  }
}
