import type { Request, Response } from "express";
import { ApiStatusMessage } from "../types/Api.js";

export const logoutEndpointHandler = (req: Request, res: Response) => {
  if (req.cookies.token) {
    res.clearCookie("token");
  }
  res.send({ success: true, message: "Logged out" } as ApiStatusMessage);
};