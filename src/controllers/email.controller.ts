import { Request, Response } from "express";
import { sendEmail } from "../services/email.service";

export const sendWelcomeEmail = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    console.log("Email", email, "Name:", name);
    
    await sendEmail(
      email,
      "Welcome to My App 🎉",
      `<h1>Hello ${name}</h1><p>Thanks for signing up!</p>`
    );

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error: unknown) {
  if (error instanceof Error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Failed to send email",
    error: String(error),
  });
}

};
