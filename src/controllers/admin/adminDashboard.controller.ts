import { Request, Response, NextFunction } from "express";
import * as adminDashboardService from "../../services/admin/adminDashboard.service";
import { getIdFromHeader } from "../../middlewares/auth";
import * as userService from "../../utils/service/user.service";
import { ApiError } from "../../utils/apiError";

export const getAdminProfile = async (req: Request, res: Response, next: NextFunction) => {
  const merchantId = getIdFromHeader(req);
  try {
    const profile = await userService.getUserProfile(merchantId);
    if (!profile) throw new ApiError(404, "Admin not found!");
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const updateAdminProfile = async (req: Request, res: Response, next: NextFunction) => {
  const merchantId = getIdFromHeader(req);
  try {
    const updateProfile = await userService.updateUser(merchantId, req.body);
    if (!updateProfile) throw new ApiError(404, "Admin not found!");
    res.json(updateProfile);
  } catch (error) {
    next(error);
  }
};

export const getMerchantOrders = async (req: Request, res: Response, next: NextFunction) => {
  const merchantId = getIdFromHeader(req);
  const status = req.query.status as string | undefined;
  const period = req.query.period as "day" | "month" | "year" | undefined;
  try {
    const orders = await adminDashboardService.getMerchantOrders(merchantId, status as any, period);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};


export const getRevenue = async (req: Request, res: Response, next: NextFunction) => {
  const merchantId = getIdFromHeader(req);
  // ปรับ period ให้ตรงกับ model ใหม่: day / week / month
  const period = (req.query.period as "day" | "week" | "month") || "month";

  try {
    const revenue = await adminDashboardService.getRevenue(merchantId, period);
    if (!revenue) throw new ApiError(404, "Revenue not found!");
    res.json({ revenue });
  } catch (error) {
    next(error);
  }
};
export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  const merchantId = getIdFromHeader(req);
  const period = req.query.period as "day" | "month" | "year" | undefined;
  try {
    const notifications = await adminDashboardService.getNotifications(merchantId, period);
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

export const getCategorySalesController = async (req: Request, res: Response) => {
  const period = req.query.period as "day" | "month" | "year" | undefined;
  try {
    const result = await adminDashboardService.getCategorySales(period);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
