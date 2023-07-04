import type { Request, Response } from "express";
import { newStatusMessage } from "../util/newStatusMessage.js";

export function indexEndpointHandler(req: Request, res: Response) {
  res.send(newStatusMessage(true, `API is working`));
}
