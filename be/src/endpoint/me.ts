import { Response } from "express";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest.js";

export const meEndpointHandler = (req: AuthenticatedRequest, res: Response) =>
  res.send({ success: true, data: req.user! });
