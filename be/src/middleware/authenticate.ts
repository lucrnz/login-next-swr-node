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

import { NextFunction, Response } from "express";
import { StatusCode } from "status-code-enum";
import jwt from "jsonwebtoken";
import { JWTTokenContents, UserWithPassword } from "../types/Entities.js";
import {
  ApiResponse,
  ApiStatusMessage,
  AuthenticatedRequest
} from "../types/Api.js";
import { EnvironmentVariable, getEnvironmentVariable } from "../env.js";
import { userStore } from "../lib/store/implemented/stores.js";

const messages = {
  authRequired: "Authentication required",
  authFailed: "Authentication failed",
  expiredLogin: "Expired login",
  internalError: "Internal server error"
};

export default async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const secret = getEnvironmentVariable(
    EnvironmentVariable.JwtSecret
  ) as string;

  const token: string | undefined = req.cookies.token;

  if (!token || token === "deleted") {
    return res.status(StatusCode.ClientErrorUnauthorized).send({
      success: false,
      data: { message: messages.authRequired }
    } as ApiResponse<ApiStatusMessage>);
  }

  try {
    const { userId } = jwt.verify(token, secret) as JWTTokenContents;
    const userExists = await userStore.Exists(userId);

    if (!userExists) {
      return res.status(StatusCode.ClientErrorUnauthorized).send({
        success: false,
        data: { message: messages.authFailed }
      } as ApiResponse<ApiStatusMessage>);
    }

    const user = (await userStore.Read(userId))!;

    // User is authenticated, add user object to request and call next middleware
    const { password, ...userData } = user;
    req.user = userData;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(StatusCode.ClientErrorUnauthorized).send({
        success: false,
        data: { message: messages.expiredLogin }
      } as ApiResponse<ApiStatusMessage>);
    }

    console.error("[auth middleware][node api]", err);
    return res.status(StatusCode.ServerErrorInternal).send({
      success: false,
      data: { message: messages.expiredLogin }
    } as ApiResponse<ApiStatusMessage>);
  }
}
