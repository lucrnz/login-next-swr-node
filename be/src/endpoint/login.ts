import { StatusCode } from "status-code-enum";
import { UserWithPassword } from "../types/User.js";
import type { CookieOptions, Request, Response } from "express";

import users from "../data/users.js";
import jwt from "jsonwebtoken";
import { EnvironmentVariable, getEnv } from "../env.js";
import { newStatusMessage } from "../util/newStatusMessage.js";

export function loginEndpointHandler(req: Request, res: Response) {
  const secret = getEnv(EnvironmentVariable.JwtSecret) as string;

  const { email, password } = req.body as Partial<UserWithPassword>;

  if (!email || !password) {
    return res
      .status(StatusCode.ClientErrorBadRequest)
      .send(newStatusMessage(false, "Bad Request"));
  }

  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (!user) {
    return res
      .status(StatusCode.ClientErrorForbidden)
      .send(newStatusMessage(false, "Invalid email or password"));
  }

  const token = jwt.sign({ id: user.id }, secret, { expiresIn: "1h" });

  res.setHeader("cache-control", "no-cache");

  const environment = `${getEnv(EnvironmentVariable.NodeEnv)}`;

  console.log("node env", environment);

  const cookieConfig: CookieOptions =
    environment === "production"
      ? { httpOnly: true, sameSite: "none", secure: true }
      : { httpOnly: true };

  res.cookie("token", token, cookieConfig);

  res.send(newStatusMessage(true, "Logged in"));
}
