import nodemailer from "nodemailer"
import * as userModel from "../../models/user/user.model";
import jwt from "jsonwebtoken";
import { OrderItemResponseDto } from "../../dtos/order.dto";

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const generateProductRows = (items: { productName: string; productImage: string; quantity: number; price: number }[]) =>
    items.map(item => `
        <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px; text-align: center;">
                <img src="${item.productImage}" alt="${item.productName}" width="60" style="border-radius: 8px;" />
            </td>
            <td style="padding: 10px;">${item.productName}</td>
            <td style="padding: 10px; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; text-align: right;">฿${item.price.toLocaleString()}</td>
        </tr>
    `).join("");


export const sendResetEmail = async (email: string) => {
    const user = await userModel.getUserByEmail(email);
    if (!user) throw new Error("User not found");

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    console.log("resetLink:", resetLink);

    // HTML Email template
    const htmlEmail = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: 'Helvetica', 'Arial', sans-serif;
        background-color: #ecfdf5;
        color: #1f2937;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        overflow: hidden;
      }
      .header {
        background-color: #047857;
        color: #ffffff;
        text-align: center;
        padding: 20px;
        font-size: 24px;
        font-weight: bold;
      }
      .content {
        padding: 30px 20px;
        text-align: center;
      }
      .content h2 {
        color: #065f46;
        font-size: 20px;
        margin-bottom: 16px;
      }
      .content p {
        font-size: 16px;
        margin-bottom: 24px;
        color: #374151;
      }
      .btn {
        display: inline-block;
        padding: 12px 24px;
        background-color: #047857;
        color: #000000;
        text-decoration: none;
        border-radius: 8px;
        font-weight: bold;
        transition: background 0.3s;
      }
      .btn:hover {
        background-color: #065f46;
      }
      .footer {
        padding: 20px;
        font-size: 14px;
        color: #6b7280;
        text-align: center;
      }
      .footer a {
        color: #047857;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Shopcart / Merchant Portal</div>
      <div class="content">
        <h2>Reset Your Password</h2>
        <p>We received a request to reset your password. Click the button below to set a new password.</p>
          <a href="${resetLink}" 
            class="btn" 
            style="color: #ffffff !important; text-decoration: none !important;">
            Reset Password
          </a>
        <p style="margin-top: 24px; font-size: 14px; color: #6b7280;">If you didn’t request this, you can safely ignore this email.</p>
      </div>
      <div class="footer">
        Need help? <a href="${process.env.SUPPORT_LINK || "#"}">Contact Support</a><br/>
        &copy; 2025 Shopcart. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;

    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: user.email,
        subject: "Reset Your Password",
        html: htmlEmail,
    });

    return token;
};

export const sendUserSignupEmail = async (email: string, name: string) => {
    console.log("email", email);
    console.log("name", name);

    const htmlEmail = `
  <h1>New User Registration Alert</h1>
  <p>A new user has just registered on <strong>Shopcart</strong>.</p>
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p>Please review their account or welcome them to the platform if needed.</p>
  <p>Best regards,<br/>Shopcart System</p>
`;

    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: "Welcome to Shopcart!",
        html: htmlEmail,
    });
}


export const productLowStockAlert = async (email: string, productName: string, currentStock: number) => {
    const htmlEmail = `
  <h1>Low Stock Alert</h1>
  <p>The stock for the following product is running low:</p>
  <p><strong>Product Name:</strong> ${productName}</p>
  <p><strong>Current Stock:</strong> ${currentStock}</p>
  <p>Please consider restocking this item soon to avoid stockouts.</p>
  <p>Best regards,<br/>Shopcart Inventory System</p>
`;

    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: "Low Stock Alert",
        html: htmlEmail,
    });
}

//send order succes email to admin when user is paying succesfully
export const orderSuccessEmailAdmin = async (
    email: string,
    userName: string,
    items: { productName: string; productImage: string; quantity: number; price: number }[],
    subtotal: number,
    shipping: number,
    tax: number,
    totalAmount: number
) => {
    const productRows = generateProductRows(items);

    const htmlEmail = `
  <div style="font-family: 'Segoe UI', Tahoma, sans-serif; color: #333; background: #f9fafb; padding: 30px;">
    <div style="max-width: 700px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #16a34a; color: white; padding: 24px 30px;">
        <h1 style="margin: 0;">🛒 New Order Received!</h1>
        <p><strong>${userName}</strong> has placed a new order.</p>
      </div>

      <div style="padding: 30px;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead style="background-color: #f3f4f6;">
            <tr>
              <th style="padding: 12px;">Image</th>
              <th style="padding: 12px; text-align: left;">Product</th>
              <th style="padding: 12px;">Qty</th>
              <th style="padding: 12px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>${productRows}</tbody>
        </table>

        <table style="width: 100%; font-size: 16px; border-top: 1px solid #ddd; padding-top: 10px;">
          <tr>
            <td style="padding: 8px 0;">Subtotal:</td>
            <td style="text-align: right;">฿${subtotal.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">Shipping:</td>
            <td style="text-align: right;">฿${shipping.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">Tax (10%):</td>
            <td style="text-align: right;">฿${tax.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; font-weight: bold; font-size: 18px;">Total:</td>
            <td style="text-align: right; font-weight: bold; font-size: 18px;">฿${totalAmount.toLocaleString()}</td>
          </tr>
        </table>

        <p style="margin-top: 20px;">Please process this order accordingly.</p>
      </div>
    </div>
  </div>
  `;

    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: `🛍️ New Order from ${userName}`,
        html: htmlEmail,
    });
};

// export const sendingPendingStatusPayment = async (
//     email: string,
//     userName: string,
//     orderId: number,
//     items: { productName: string; productImage: string; quantity: number; price: number }[],
//     totalAmount: number
// ) => {
//     const productRows = items
//         .map(
//             (item) => `
//         <tr style="border-bottom: 1px solid #ddd;">
//           <td style="padding: 10px; text-align: center;">
//             <img src="${item.productImage}" alt="${item.productName}" width="60" style="border-radius: 8px;" />
//           </td>
//           <td style="padding: 10px;">${item.productName}</td>
//           <td style="padding: 10px; text-align: center;">${item.quantity}</td>
//           <td style="padding: 10px; text-align: right;">฿${item.price.toLocaleString()}</td>
//         </tr>
//       `
//         )
//         .join("");

//     const htmlEmail = `
//     <div style="font-family: Arial, sans-serif; color: #333;">
//       <h1>🕓 Payment Pending</h1>
//       <p><strong>${userName}</strong>, your payment for order #${orderId} is currently pending verification.</p>
//       <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
//         <thead style="background-color: #f3f4f6;">
//           <tr>
//             <th style="padding: 10px;">Image</th>
//             <th style="padding: 10px; text-align: left;">Product</th>
//             <th style="padding: 10px;">Qty</th>
//             <th style="padding: 10px; text-align: right;">Price</th>
//           </tr>
//         </thead>
//         <tbody>${productRows}</tbody>
//       </table>
//       <p style="margin-top: 20px; font-size: 16px;">
//         <strong>Total Amount:</strong> ฿${totalAmount.toLocaleString()}
//       </p>
//       <p style="margin-top: 30px;">We are currently verifying your payment and will notify you once it’s confirmed.</p>
//       <p>Best regards,<br/><strong>Shopcart Payment Team</strong></p>
//     </div>
//   `;

//     await transporter.sendMail({
//         from: process.env.SMTP_USER,
//         to: email,
//         subject: `🕓 Your Payment for Order #${orderId} is Pending`,
//         html: htmlEmail,
//     });
// };
export const orderSuccessEmailUser = async (
    email: string,
    userName: string,
    items: { productName: string; productImage: string; quantity: number; price: number }[],
    subtotal: number,
    shipping: number,
    tax: number,
    totalAmount: number
) => {
    const productRows = generateProductRows(items);

    const htmlEmail = `
  <div style="font-family: 'Segoe UI', Tahoma, sans-serif; color: #333; background: #f9fafb; padding: 30px;">
    <div style="max-width: 700px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #16a34a; color: white; padding: 24px 30px;">
        <h1 style="margin: 0;">🎉 Thank You for Your Purchase!</h1>
        <p>Hi <strong>${userName}</strong>, your order has been successfully confirmed.</p>
      </div>

      <div style="padding: 30px;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead style="background-color: #f3f4f6;">
            <tr>
              <th style="padding: 12px;">Image</th>
              <th style="padding: 12px; text-align: left;">Product</th>
              <th style="padding: 12px;">Qty</th>
              <th style="padding: 12px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>${productRows}</tbody>
        </table>

        <table style="width: 100%; font-size: 16px; border-top: 1px solid #ddd; padding-top: 10px;">
          <tr>
            <td style="padding: 8px 0;">Subtotal:</td>
            <td style="text-align: right;">฿${subtotal.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">Shipping:</td>
            <td style="text-align: right;">฿${shipping.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">Tax (10%):</td>
            <td style="text-align: right;">฿${tax.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; font-weight: bold; font-size: 18px;">Total:</td>
            <td style="text-align: right; font-weight: bold; font-size: 18px;">฿${totalAmount.toLocaleString()}</td>
          </tr>
        </table>

        <p style="margin-top: 20px;">📦 Track your order from <a href="${process.env.FRONTEND_URL}/orders" style="color: #16a34a;">My Orders</a>.</p>
        <p>For questions, contact <a href="mailto:support@shopcart.com">support@shopcart.com</a></p>
      </div>
    </div>
  </div>
  `;

    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: `✅ Order Confirmation — ${userName}`,
        html: htmlEmail,
    });
};

export const sendingCompletedStatusPayment = async (
    email: string,
    userName: string,
    orderId: number,
    items: { productName: string; productImage: string; quantity: number; price: number }[],
    subtotal: number,
    shipping: number,
    tax: number,
    totalAmount: number
) => {
    const productRows = items
        .map(
            (item) => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; text-align: center;">
          <img src="${item.productImage}" alt="${item.productName}" width="60" style="border-radius: 8px;" />
        </td>
        <td style="padding: 12px;">${item.productName}</td>
        <td style="padding: 12px; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; text-align: right;">฿${item.price.toLocaleString()}</td>
      </tr>
    `
        )
        .join("");

    const htmlEmail = `
    <div style="font-family: 'Segoe UI', Tahoma, sans-serif; color: #333; background: #f9fafb; padding: 30px;">
      <div style="max-width: 700px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden;">
        <div style="background-color: #16a34a; color: white; padding: 24px 30px;">
          <h1 style="margin: 0;">✅ Payment Receipt</h1>
          <p style="margin: 6px 0 0;">Order #${orderId}</p>
        </div>

        <div style="padding: 30px;">
          <p style="font-size: 16px; margin-bottom: 12px;">
            Hi <strong>${userName}</strong>,
          </p>
          <p style="margin-bottom: 24px;">
            Thank you for your payment! Your transaction for order <strong>#${orderId}</strong> has been successfully processed.
          </p>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 12px;">Image</th>
                <th style="padding: 12px; text-align: left;">Product</th>
                <th style="padding: 12px;">Qty</th>
                <th style="padding: 12px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>${productRows}</tbody>
          </table>

          <div style="margin-top: 20px; border-top: 1px solid #ddd; padding-top: 20px;">
            <table style="width: 100%; font-size: 16px;">
              <tr>
                <td style="padding: 8px 0;">Subtotal:</td>
                <td style="text-align: right;">฿${subtotal.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">Shipping:</td>
                <td style="text-align: right;">฿${shipping.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">Tax (10%):</td>
                <td style="text-align: right;">฿${tax.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; font-weight: bold; font-size: 18px;">Total:</td>
                <td style="text-align: right; font-weight: bold; font-size: 18px;">฿${totalAmount.toLocaleString()}</td>
              </tr>
            </table>
          </div>

          <p style="margin-top: 30px; color: #4b5563;">
            Your order is now being prepared for shipment. You’ll receive a confirmation email with tracking info once it’s on the way.
          </p>

          <p style="margin-top: 20px;">Best regards,<br/><strong>Shopcart Payment Team</strong></p>
        </div>
      </div>
    </div>
  `;

    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: `✅ Payment Successful — Order #${orderId}`,
        html: htmlEmail,
    });
};