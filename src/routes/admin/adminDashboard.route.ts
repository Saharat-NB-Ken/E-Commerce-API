import { Router } from "express";
import {
  getMerchantOrders,
  getRevenue,
  getNotifications,
  getCategorySalesController,
} from "../../controllers/admin/adminDashboard.controller";
import { authorize } from "../../middlewares/auth";
import { UserRole } from "../../dtos/roles.dto";

const router = Router();

/**
 * @openapi
 * /api/admin-dashboard/orders:
 *   get:
 *     summary: Get all orders for merchant's products
 *     tags:
 *       - Merchant Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, COMPLETED, CANCELED]
 *         description: Filter orders by status
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, month, year]
 *         description: Filter orders by period
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 */
router.get("/orders", authorize(UserRole.MERCHANT), getMerchantOrders);

/**
 * @openapi
 * /api/admin-dashboard/revenue:
 *   get:
 *     summary: Get merchant revenue
 *     tags:
 *       - Merchant Analytics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month]
 *         description: Revenue period
 *     responses:
 *       200:
 *         description: Revenue retrieved successfully
 */
router.get("/revenue", authorize(UserRole.MERCHANT), getRevenue);

/**
 * @openapi
 * /api/admin-dashboard/notifications:
 *   get:
 *     summary: Get notifications for merchant
 *     tags:
 *       - Merchant Notifications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, month, year]
 *         description: Filter notifications by period
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 */
router.get("/notifications", authorize(UserRole.MERCHANT), getNotifications);

/**
 * @openapi
 * /api/admin-dashboard/category-sales:
 *   get:
 *     summary: Get sales data grouped by product category
 *     tags:
 *       - Merchant Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, month, year]
 *         description: Filter category sales by period
 *     responses:
 *       200:
 *         description: Category sales data retrieved successfully
 */
router.get("/category-sales", authorize(UserRole.MERCHANT), getCategorySalesController);

export default router;
