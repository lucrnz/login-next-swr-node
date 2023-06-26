import type { Request, Response } from "express";
import { ApiResponse, ApiStatusMessage } from "../types/Api.js";

export function logoutEndpointHandler(req: Request, res: Response) {
  if (req.cookies.token) {
    res.clearCookie("token");
  }
  res.setHeader("cache-control", "no-cache");
  res.send({
    success: true,
    data: { message: "Logged out" }
  } as ApiResponse<ApiStatusMessage>);
}
