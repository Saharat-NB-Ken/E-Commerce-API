import express, { Router } from "express";
import {
    createPaymentCard,
    createPaymentPromptPay,
    getQrStatusById,
} from "../../controllers/admin/payment.controller";

const router = Router();


/**
 * @swagger
 * /api/payment/stripe/create-payment-promptpay:
 *   post:
 *     summary: Create a new payment promptpay
 *     tags: [Stripe]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 1000
 *               currency:
 *                 type: string
 *                 example: thb
 *               metadata:
 *                 type: object
 *                 example: { orderId: "ORD12345" }
 *     responses:
 *       200:
 *         description: Payment intent created successfully
 *       500:
 *         description: Internal server error
 */
router.post(
    "/stripe/create-payment-promptPay",
    createPaymentPromptPay
);

/**
 * @swagger
 * /api/payment/stripe/create-payment-card:
 *   post:
 *     summary: Create a new payment card
 *     tags: [Stripe]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 1000
 *               currency:
 *                 type: string
 *                 example: thb
 *               metadata:
 *                 type: object
 *                 example: { orderId: "ORD12345" }
 *     responses:
 *       200:
 *         description: Payment intent created successfully
 *       500:
 *         description: Internal server error
 */
router.post(
    "/stripe/create-payment-card",
    createPaymentCard
);

/**
 * @swagger
 * /api/payment/qr/status/{id}:
 *   get:
 *     summary: ตรวจสอบสถานะ QR Payment
 *     tags: [Payment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: คืนค่า status ของ payment
 *       404:
 *         description: ไม่พบ payment
 */
router.get("/qr/status/:id", getQrStatusById);

export default router;

