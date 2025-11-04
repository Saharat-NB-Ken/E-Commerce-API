import { Router } from "express";
import { authorize } from "../../middlewares/auth";
import { UserRole } from "../../dtos/roles.dto";
import { getNotifications, getCart, getMoneySpent, getOrders, getOrdersCount, getProductsByCategory, getProfile } from "../../controllers/user/userDashboard.controller";

const router = Router();

/**
 * @openapi
 * /api/user-dashboard/profile:
 *   get:
 *     summary: Get user's profile
 *     tags:
 *       - User Dashboard
 *     security:
 *       - bearerAuth: []
 *         description: User ID
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 */
router.get("/profile", authorize(UserRole.USER), getProfile);

/**
 * @openapi
 * /api/user-dashboard/money-spent:
 *   get:
 *     summary: Get total money spent by user
 *     tags:
 *       - User Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's total money spent
 */
router.get("/money-spent", authorize(UserRole.USER), getMoneySpent);

/**
 * @openapi
 * /api/user-dashboard/orders-count:
 *   get:
 *     summary: Get total number of orders by user
 *     tags:
 *       - User Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total orders count
 */
router.get("/orders-count", authorize(UserRole.USER), getOrdersCount);

/**
 * @openapi
 * /api/user-dashboard/products-by-category:
 *   get:
 *     summary: Get products purchased grouped by category
 *     tags:
 *       - User Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products grouped by category
 */
router.get("/products-by-category", authorize(UserRole.USER), getProductsByCategory);

/**
 * @openapi
 * /api/user-dashboard/cart:
 *   get:
 *     summary: Get user's cart
 *     tags:
 *       - User Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's cart retrieved
 */
router.get("/cart", authorize(UserRole.USER), getCart);

/**
 * @openapi
 * /api/user-dashboard/orders:
 *   get:
 *     summary: Get all orders of the user
 *     tags:
 *       - User Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's orders retrieved
 */
router.get("/orders", authorize(UserRole.USER), getOrders);

/**
 * @openapi
 * /api/user-dashboard/notifications:
 *   get:
 *     summary: Get user's notifications
 *     tags:
 *       - User Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications retrieved
 */
router.get("/notifications", authorize(UserRole.USER), getNotifications);

export default router;
