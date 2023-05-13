import { Response } from "express";
import { ApiStatusMessage } from "../types/Api.js";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest.js";

export const fooEndpointHandler = (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { name } = req.user!;

  res.send({
    success: true,
    message: `Hello, ${name}!`,
  } as ApiStatusMessage);
};
