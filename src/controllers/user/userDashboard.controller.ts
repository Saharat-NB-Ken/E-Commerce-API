import { Request, Response, NextFunction } from "express";
import * as dashboardService from "../../services/user/userDashboard.service";
import { getIdFromHeader } from "../../middlewares/auth";

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getIdFromHeader(req);
    const data = await dashboardService.getProfile(userId);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export const getMoneySpent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getIdFromHeader(req);
    const total = await dashboardService.getMoneySpent(userId);
    res.json({ total });
  } catch (err) {
    next(err);
  }
}

export const getOrdersCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getIdFromHeader(req);
    const count = await dashboardService.getOrdersCount(userId);
    res.json({ count });
  } catch (err) {
    next(err);
  }
}

export const getProductsByCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getIdFromHeader(req);
    const data = await dashboardService.getProductsByCategory(userId);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getIdFromHeader(req);
    const data = await dashboardService.getCart(userId);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getIdFromHeader(req);
    const data = await dashboardService.getOrders(userId);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

//   async getWishlist(req: Request, res: Response, next: NextFunction) {
//     try {
//       const userId = Number(req.params.userId);
//       const data = await dashboardService.getWishlist(userId);
//       res.json(data);
//     } catch (err) {
//       next(err);
//     }
//   }

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getIdFromHeader(req);
    const data = await dashboardService.getNotifications(userId);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

