import { StatusCode } from "status-code-enum";
import { ApiStatusMessage } from "../types/Api.js";
import { UserWithPassword } from "../types/User.js";
import type { Request, Response } from "express";

import users from "../data/users.js";
import jwt from "jsonwebtoken";
import { EnvironmentVariable, getEnv } from "../env.js";

export const loginEndpointHandler = (req: Request, res: Response) => {
  const secret = getEnv(EnvironmentVariable.JwtSecret) as string;

  const { email, password } = req.body as Partial<UserWithPassword>;

  if (!email || !password) {
    return res
      .status(StatusCode.ClientErrorBadRequest)
      .send({ success: false, message: "Bad Request" } as ApiStatusMessage);
  }

  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (!user) {
    return res.status(StatusCode.ClientErrorForbidden).send({
      success: false,
      message: "Invalid email or password",
    } as ApiStatusMessage);
  }

  // Generate JWT token
  const token = jwt.sign({ id: user.id }, secret, { expiresIn: "1h" });

  res.setHeader("cache-control", "no-cache");

  // Set token as HTTP-only cookie
  res.cookie("token", token, { httpOnly: true });

  res.send({ success: true, message: "Logged in" } as ApiStatusMessage);
};