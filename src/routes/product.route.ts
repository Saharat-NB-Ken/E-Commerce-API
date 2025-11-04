import { Router } from "express";
import {
  createImage,
  getAllProducts,
  getProductById
} from "../controllers/product.controller";

const router = Router();

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Retrieve a list of products
 *     tags:
 *       - Products
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
 *         description: Number of items per page
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
 *           nullable: true
 *         description: Filter products by category name
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           nullable: true
 *         description: Search products by name or description
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           nullable: true
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           nullable: true
 *         description: Maximum price filter
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 orderBy:
 *                   type: string
 *                 orderDirection:
 *                   type: string
 *                 category:
 *                   type: string
 *                   nullable: true
 *                 search:
 *                   type: string
 *                   nullable: true
 *                 minPrice:
 *                   type: number
 *                   nullable: true
 *                 maxPrice:
 *                   type: number
 *                   nullable: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductResponseDto'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllProducts);


/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     summary: Retrieve a single product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product ID
 *     responses:
 *       200:
 *         description: A single product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponseDto'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id",getProductById);

/**
 * @openapi
 * /api/products:
 *   post:
 *     summary: Retrieve a single product by ID
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: A single product
 *         content:
 *           application/json:
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.post("/",createImage);
export default router;
 