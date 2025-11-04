import { Router } from "express";
import { sendWelcomeEmail } from "../controllers/email.controller";

const router = Router();

/**
 * @swagger
 * /api/email/send:
 *   post:
 *     summary: Send welcome email
 *     description: Sends a welcome email to a new user
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendWelcomeEmailRequest'
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SendWelcomeEmailResponse'
 *       500:
 *         description: Failed to send email
 */
router.post("/send", sendWelcomeEmail);

export default router;
