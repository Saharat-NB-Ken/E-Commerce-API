import { Router } from "express";
import { authorize } from "../../middlewares/auth";
import { UserRole } from "../../dtos/roles.dto";
import { getOrders, getOrderById, updateOrderStatus, softDeleteOrderController, restoreOrderController } from "../../controllers/admin/adminOrderManagement.controller";

const router = Router();

/**
 * @openapi
 * /api/admin-order-management:
 *   get:
 *     summary: Get all orders with filters
 *     tags:
 *       - Admin Orders
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, status, total]
 *       - in: query
 *         name: orderDirection
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, COMPLETED, CANCELED]
 *       - in: query
 *         name: isDeleted
 *         schema: { type: boolean }
 *       - in: query
 *         name: userId
 *         schema: { type: integer }
 *       - in: query
 *         name: dateFrom
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: dateTo
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, month, year]
 *         description: Shortcut for filtering by period (overrides dateFrom/dateTo if provided)
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 */
router.get("", authorize(UserRole.MERCHANT), getOrders);

/**
 * @openapi
 * /api/admin-order-management/{id}:
 *   get:
 *     summary: Get a specific order by ID
 *     tags:
 *       - Admin Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 */
router.get("/:id", authorize(UserRole.MERCHANT), getOrderById);

/**
 * @openapi
 * /api/admin-order-management/{id}/status:
 *   patch:
 *     summary: Update order status
 *     tags:
 *       - Admin Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, COMPLETED, CANCELED]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 */
router.patch("/:id/status", authorize(UserRole.MERCHANT), updateOrderStatus);

/**
 * @openapi
 * /api/admin-order-management/{id}/delete:
 *   patch:
 *     summary: Soft delete an order by ID
 *     tags:
 *       - Admin Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Order soft deleted successfully
 */
router.patch("/:id/delete", authorize(UserRole.MERCHANT), softDeleteOrderController);

/**
 * @openapi
 * /api/admin-order-management/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted order by ID
 *     tags:
 *       - Admin Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Order restored successfully
 */
router.patch("/:id/restore", authorize(UserRole.MERCHANT), restoreOrderController);

export default router;
