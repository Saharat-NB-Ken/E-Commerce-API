import { Router } from "express";
import { UserRole } from "../../dtos/roles.dto";
import { authorize } from "../../middlewares/auth";
import { createProduct, deleteProduct, getAllProductsOfMerchantController, getProductDetailsById, updateProduct } from "../../controllers/admin/adminProductManagement.controller";
import { joiValidate } from "../../middlewares/joiValidate";
import { createProductSchema, updateProductSchema } from "../../validator/product.joi";

const router = Router();
/**
 * @openapi
 * /api/admin-product-management/products:
 *   get:
 *     summary: Get all products of the merchant with pagination and filters
 *     tags:
 *       - Merchant Products
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
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category name
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by product name or description
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 100
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 10
 *                 orderBy:
 *                   type: string
 *                   example: createdAt
 *                 orderDirection:
 *                   type: string
 *                   example: desc
 *                 category:
 *                   type: string
 *                   example: Electronics
 *                 search:
 *                   type: string
 *                   example: iPhone
 *                 minPrice:
 *                   type: number
 *                   example: 100
 *                 maxPrice:
 *                   type: number
 *                   example: 1000
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductResponseDto'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get("/products", authorize(UserRole.MERCHANT), getAllProductsOfMerchantController);

/**
 * @openapi
 * /api/admin-product-management/products/{productId}:
 *   get:
 *     summary: Get a specific product details
 *     tags:
 *       - Merchant Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Product details retrieved successfully
 */
router.get("/products/:productId", authorize(UserRole.MERCHANT), getProductDetailsById);
    

/**
 * @openapi
 * /api/admin-product-management/products:
 *   post:
 *     summary: Create a new product (Admin only)
 *     tags:
 *       - Admin Management
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductDto'
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post("/products", authorize(UserRole.MERCHANT), joiValidate(createProductSchema),  createProduct);

/**
 * @openapi
 * /api/admin-product-management/products/{id}:
 *   patch:
 *     summary: Update a product by ID (Admin only)
 *     tags:
 *       - Admin Management
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductDto'
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
router.patch("/products/:id", authorize(UserRole.MERCHANT), joiValidate(updateProductSchema),  updateProduct);

/**
 * @openapi
 * /api/admin-product-management/products/{id}:
 *   delete:
 *     summary: Delete a product by ID (Admin only)
 *     tags:
 *       - Admin Management
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the product to delete
 *     responses:
 *       200:
 *         description: Product deleted successfully
 */
router.delete("/products/:id", authorize(UserRole.MERCHANT), deleteProduct);

export default router;