import { Response } from "express";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest.js";
import { newStatusMessage } from "../util/newStatusMessage.js";

export function helloEndpointHandler(req: AuthenticatedRequest, res: Response) {
  const { name } = req.user!;

  res.send(newStatusMessage(true, `Hello, ${name}!`));
}
