import type { Request, Response } from "express";
import { ApiResponseHandler } from "../utils/responses/apiResponse.js";

export const notFoundHandler = (req: Request, res: Response): void => {
  ApiResponseHandler.error(
    res,
    "Route not found",
    `Cannot ${req.method} ${req.originalUrl}`,
    404
  );
};