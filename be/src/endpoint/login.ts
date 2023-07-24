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
import type { CookieOptions, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWTTokenContents, UserWithPassword } from "../types/Entities.js";
import validateAllFields from "../util/validateAllFields.js";
import newStatusMessage from "../util/newStatusMessage.js";
import Store, { EnvironmentVariable } from "../store/implemented/stores.js";
import { ApiResponse, ApiStatusMessage } from "../types/Api.js";

export default async function loginEndpointHandler(
  req: Request,
  res: Response
) {
  const store = await Store.GetInstance();
  const secret = store.GetEnvironmentVariable(EnvironmentVariable.JwtSecret);

  const body = req.body as Partial<UserWithPassword>;
  const values = validateAllFields([body.email, body.password]);

  if (!values.length) {
    return res
      .status(StatusCode.ClientErrorBadRequest)
      .send(newStatusMessage(false, "Bad Request"));
  }

  const [email, password] = values;
  const foundUser = await store.UserStore.ValidateUserLogin(email, password);

  if (!foundUser) {
    return res.status(StatusCode.ClientErrorUnauthorized).send({
      success: false,
      data: { message: "Invalid email or password" }
    } as ApiResponse<ApiStatusMessage>);
  }

  const token = jwt.sign({ userId: foundUser.id } as JWTTokenContents, secret, {
    expiresIn: store.GetEnvironmentVariable(EnvironmentVariable.JwtExpireTime)
  });

  res.setHeader("cache-control", "no-cache");

  const cookieConfig: CookieOptions =
    store.GetEnvironmentVariable(EnvironmentVariable.NodeEnv) === "production"
      ? { httpOnly: true, sameSite: "none", secure: true }
      : { httpOnly: true };

  res.cookie("token", token, cookieConfig);

  res.send(newStatusMessage(true, "Logged in"));
}
