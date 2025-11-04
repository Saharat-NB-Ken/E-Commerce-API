import { Router } from "express";
import {
  getCartController,
  addCartItemController,
  setCartItemQuantityController,
  incrementCartItemController,
  decrementCartItemController,
  removeCartItemController,
  clearCartController,
} from "../../controllers/user/cart.controller";
import { authorize } from "../../middlewares/auth";
import { UserRole } from "../../dtos/roles.dto";
import { joiValidate } from "../../middlewares/joiValidate";
import { addCartItemSchema, updateCartItemSchema } from "../../validator/cart.joi";

const router = Router();

/**
 * @openapi
 * /api/cart:
 *   get:
 *     summary: Get current user's cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 */
router.get("/", authorize(UserRole.USER), getCartController);

/**
 * @openapi
 * /api/cart:
 *   post:
 *     summary: Add item to cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddCartItemDto'
 *     responses:
 *       201:
 *         description: Cart item added successfully
 */
router.post("/", authorize(UserRole.USER), joiValidate(addCartItemSchema), addCartItemController);

/**
 * @openapi
 * /api/cart/set:
 *   patch:
 *     summary: Set quantity of a cart item
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCartItemDto'
 *             example:
 *               cartItemId: 1
 *               quantity: 10
 *     responses:
 *       200:
 *         description: Cart item quantity updated
 */
router.patch("/set", authorize(UserRole.USER), joiValidate(updateCartItemSchema), addCartItemController);

/**
 * @openapi
 * /api/cart/{cartItemId}/increment:
 *   patch:
 *     summary: Increment quantity of a cart item
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               incrementBy:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Cart item quantity incremented
 */
router.patch("/:cartItemId/increment", authorize(UserRole.USER), incrementCartItemController);

/**
 * @openapi
 * /api/cart/{cartItemId}/decrement:
 *   patch:
 *     summary: Decrement quantity of a cart item
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               decrementBy:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Cart item quantity decremented
 */
router.patch("/:cartItemId/decrement", authorize(UserRole.USER), decrementCartItemController);

/**
 * @openapi
 * /api/cart/{cartItemId}:
 *   delete:
 *     summary: Delete a specific cart item
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Cart item deleted successfully
 */
router.delete("/:cartItemId", authorize(UserRole.USER), removeCartItemController);

/**
 * @openapi
 * /api/cart:
 *   delete:
 *     summary: Clear all items in cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 */
router.delete("/", authorize(UserRole.USER), clearCartController);

export default router;
