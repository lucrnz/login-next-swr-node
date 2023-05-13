import { Request } from "express";
import { User } from "./User.js";

export interface AuthenticatedRequest extends Request {
  user?: User;
}
