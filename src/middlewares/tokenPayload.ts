import { JwtPayload } from "jsonwebtoken";
import { UserRole } from "../dtos/roles.dto";

export interface TokenPayload extends JwtPayload {
  id: number;
  name: string;
  role: UserRole;
  email: string;
}