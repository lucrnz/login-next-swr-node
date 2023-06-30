import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest.js";
import { StatusCode } from "status-code-enum";
import jwt from "jsonwebtoken";
import users from "../data/users.js";
import { UserWithPassword } from "../types/User.js";
import { ApiResponse, ApiStatusMessage } from "../types/Api.js";
import { EnvironmentVariable, getEnv } from "../env.js";

export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const secret = getEnv(EnvironmentVariable.JwtSecret) as string;

  const token: string | undefined = req.cookies.token;

  if (!token || token === "deleted") {
    return res.status(StatusCode.ClientErrorUnauthorized).send({
      success: false,
      data: { message: "Authentication required" }
    } as ApiResponse<ApiStatusMessage>);
  }

  try {
    const decoded = jwt.verify(token, secret) as Partial<UserWithPassword>;
    const userId = decoded.id;

    // Find user by ID
    const user = users.find((user) => user.id === userId);

    if (!user) {
      return res.status(StatusCode.ClientErrorUnauthorized).send({
        success: false,
        data: { message: "Authentication failed" }
      } as ApiResponse<ApiStatusMessage>);
    }

    // User is authenticated, add user object to request and call next middleware
    const { password, ...userData } = user;
    req.user = userData;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(StatusCode.ClientErrorUnauthorized).send({
        success: false,
        data: { message: "Expired login" }
      } as ApiResponse<ApiStatusMessage>);
    }

    console.error("[node api]", err);
    return res.status(StatusCode.ServerErrorInternal).send({
      success: false,
      data: { message: "Internal server error" }
    } as ApiResponse<ApiStatusMessage>);
  }
}
