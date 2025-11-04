import Stripe from "stripe";
import { Request, Response } from "express";
import { getEmailFromToken, getNameFromToken } from "../../middlewares/auth";
import * as PaymentService from "../../services/user/payment.service"

export const createPaymentPromptPay = async (req: Request, res: Response) => {
    try {
        const email = getEmailFromToken(req);
        const name = getNameFromToken(req);
        const { amount, currency = "thb", metadata } = req.body;

        if (!amount) {
            return res.status(400).json({ error: "amount is required" });
        }

        const result = await PaymentService.createPaymentIntent(
            amount,
            currency,
            metadata,
            "promptpay",
            { email, name }
        );

        res.json(result);
    } catch (error) {
        console.error("PromptPay Payment creation failed:", error);
        res.status(500).json({ error: (error as Error).message });
    }
};

/**
 * 🔹 API: สร้าง PaymentIntent สำหรับ Credit/Debit Card
 */
export const createPaymentCard = async (req: Request, res: Response) => {
    try {
        const email = getEmailFromToken(req);
        const name = getNameFromToken(req);
        const { amount, currency = "thb", metadata } = req.body;

        if (!amount) {
            return res.status(400).json({ error: "amount is required" });
        }

        const result = await PaymentService.createPaymentIntent(
            amount,
            currency,
            metadata,
            "card",
            { email, name }
        );

        res.json(result);
    } catch (error) {
        console.error("❌ Card Payment creation failed:", error);
        res.status(500).json({ error: (error as Error).message });
    }
};

export const getQrStatusById = async (req: Request, res: Response) => {
    const paymentId = req.params.id;
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-09-30.clover" });

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
        // console.log("payment Intent", paymentIntent);

        res.json({
            paymentId,
            status: paymentIntent.status, // "succeeded", "requires_payment_method", "processing", etc.
        });
    } catch (err) {
        console.error(err);
        res.status(404).json({ status: "Not found" });
    }
};
