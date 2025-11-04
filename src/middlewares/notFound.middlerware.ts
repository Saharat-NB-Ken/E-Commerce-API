import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(ApiError.notFound(`Route ${req.originalUrl} not found`));
};
