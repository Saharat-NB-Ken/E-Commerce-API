import { Stripe } from "stripe";

export const createPaymentIntent = async (
    amount: string,
    currency = "thb",
    metadata: Record<string, any>,
    paymentMethodType: "promptpay" | "card",
    billing: { email?: string; name?: string }
) => {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error("STRIPE_SECRET_KEY is missing in environment variables");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2025-09-30.clover",
    });

    const amountInSmallestUnit = Math.round(Number(amount) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInSmallestUnit,
        currency,
        payment_method_types: [paymentMethodType],
        metadata
    });

    // 🧾 ถ้าเป็น PromptPay — confirm และส่ง QR code กลับ
    if (paymentMethodType === "promptpay") {
        const confirmedIntent = await stripe.paymentIntents.confirm(paymentIntent.id, {
            payment_method_data: {
                type: "promptpay",
                billing_details: billing,
            },
        });

        const qrUrl = confirmedIntent?.next_action?.promptpay_display_qr_code?.image_url_png;
        if (!qrUrl) throw new Error("QR URL not found in next_action");

        return {
            success: true,
            type: "promptpay",
            paymentId: confirmedIntent.id,
            clientSecret: confirmedIntent.client_secret,
            qrUrl,
            status: confirmedIntent.status,
        };
    }

    // 💳 ถ้าเป็น Card — ส่ง clientSecret กลับไป confirm ที่ frontend
    if (paymentMethodType === "card") {
        console.log("1112313242423");
        console.log("paymentIntent", paymentIntent);
        
        return {
            success: true,
            type: "card",
            paymentId: paymentIntent.id,
            clientSecret: paymentIntent.client_secret,
            status: paymentIntent.status,
        };
    }

    throw new Error(`Unsupported payment method: ${paymentMethodType}`);
}