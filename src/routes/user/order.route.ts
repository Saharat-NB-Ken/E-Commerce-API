import { Router } from "express";
import { authorize } from "../../middlewares/auth";
import { UserRole } from "../../dtos/roles.dto";
import { joiValidate } from "../../middlewares/joiValidate";
import { createOrderSchema } from "../../validator/order.joi";
import { changeStatusToCompletedController, createOrderController, getUserOrdersController } from "../../controllers/user/order.controller";

const router = Router();

/**
 * @openapi
 * /api/user-orders:
 *   post:
 *     summary: Create a new order from user's cart
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderDto'
 *             example:
 *               items:
 *                 - productId: 58
 *                   quantity: 2
 *                 - productId: 59
 *                   quantity: 1
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItemResponseDto'
 */
router.post("/", authorize(UserRole.USER), joiValidate(createOrderSchema), createOrderController);

/**
 * @openapi
 * /api/user-orders/{userId}:
 *   get:
 *     summary: Get all orders for a user
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of products per page
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [name, price, stock, createdAt, updatedAt]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: orderDirection
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort direction
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItemResponseDto'
 */
router.get("/:userId", authorize(UserRole.USER), getUserOrdersController);

/**
 * @openapi
 * /api/user-orders/{orderId}:
 *   patch:
 *     summary: Get all orders for a user
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Order id for change status
 *     responses:
 *       200:
 *         description: Orders status change successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItemResponseDto'
 */
router.patch("/:orderId", changeStatusToCompletedController)

export default router;
