/*
 * Copyright 2023 lucdev<lucdev.net>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { StatusCode } from "status-code-enum";
import { JWTTokenContents, UserWithPassword } from "../types/Entities.js";
import type { CookieOptions, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { EnvironmentVariable, getEnvironmentVariable } from "../env.js";
import newStatusMessage from "../util/newStatusMessage.js";
import hashPassword from "../lib/hash-password.js";
import validateAllFields from "../util/validateAllFields.js";
import { userStore } from "../lib/store/implemented/stores.js";
import { ApiResponse, ApiStatusMessage } from "../types/Api.js";

export default async function loginEndpointHandler(
  req: Request,
  res: Response
) {
  const secret = getEnvironmentVariable(
    EnvironmentVariable.JwtSecret
  ) as string;

  const body = req.body as Partial<UserWithPassword>;
  const values = validateAllFields([body.email, body.password]);

  if (!values.length) {
    return res
      .status(StatusCode.ClientErrorBadRequest)
      .send(newStatusMessage(false, "Bad Request"));
  }

  const [email, password] = values;
  const foundUser = await userStore.FindByContents(
    (item) => item.email === email
  );

  let validPassword = false;

  if (foundUser) {
    const passwordHash = await hashPassword(password);
    validPassword = foundUser.password === passwordHash;
  }

  if (!foundUser || !validPassword) {
    return res.status(StatusCode.ClientErrorUnauthorized).send({
      success: false,
      data: { message: "Invalid email or password" }
    } as ApiResponse<ApiStatusMessage>);
  }

  const token = jwt.sign({ userId: foundUser.id } as JWTTokenContents, secret, {
    expiresIn: getEnvironmentVariable(
      EnvironmentVariable.JwtExpireTime
    ).toString()
  });

  res.setHeader("cache-control", "no-cache");

  const cookieConfig: CookieOptions =
    getEnvironmentVariable(EnvironmentVariable.NodeEnv).toString() ===
    "production"
      ? { httpOnly: true, sameSite: "none", secure: true }
      : { httpOnly: true };

  res.cookie("token", token, cookieConfig);

  res.send(newStatusMessage(true, "Logged in"));
}
