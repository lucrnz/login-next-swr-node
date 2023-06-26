import { Response } from "express";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest.js";
import { ApiResponse } from "../types/Api.js";
import { User } from "../types/User.js";

export function meEndpointHandler(req: AuthenticatedRequest, res: Response) {
  res.send({ success: true, data: req.user! } as ApiResponse<User>);
}
