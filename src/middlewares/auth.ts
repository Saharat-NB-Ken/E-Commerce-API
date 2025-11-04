import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserRole } from "../dtos/roles.dto";
import { TokenPayload } from "./tokenPayload";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}

export const authorize =
  (...allowedRoles: UserRole[]) =>
    (req: Request, res: Response, next: NextFunction) => {
      console.log("allowedRoles:", allowedRoles);

      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
        console.log("decoded:", decoded.role);

        if (!allowedRoles.includes(decoded.role)) {
          console.log("1232322");

          return res.status(403).json({ message: "Forbidden: Access denied" });
        }
        next();
      } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }
    };

export const getIdFromHeader = (req: Request) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
  return decoded.id;

}
export const getEmailFromToken = (req: Request) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
  console.log("decoded", decoded);

  return decoded.email;
}

export const getNameFromToken = (req: Request) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
  console.log("decoded", decoded);

  return decoded.name;
}