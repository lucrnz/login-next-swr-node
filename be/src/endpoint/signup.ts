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

import { Response, Request } from "express";
import { v4 as uuidv4 } from "uuid";
import { StatusCode } from "status-code-enum";
import { UserWithPassword } from "../types/Entities.js";
import newStatusMessage from "../util/newStatusMessage.js";
import validateAllFields from "../util/validateAllFields.js";
import hashPassword from "../util/hashPassword.js";
import Store from "../store/implemented/stores.js";
import { ApiResponse, ApiResponseSignup } from "../types/Api.js";

export default async function signUpEndpointHandler(
  req: Request,
  res: Response
) {
  const body = req.body as Partial<Omit<UserWithPassword, "id">>;
  if (!body) {
    return res
      .status(StatusCode.ClientErrorBadRequest)
      .json(newStatusMessage(false, "Bad request"));
  }
  const values = validateAllFields([body.email, body.name, body.password]);
  if (values.length === 0) {
    return res
      .status(StatusCode.ClientErrorBadRequest)
      .json(newStatusMessage(false, "Bad request"));
  }
  const [email, name, password] = values;

  const userId = uuidv4();

  try {
    const store = await Store.GetInstance();

    const userExists = await store.UserStore.FindUserByEmail(email);

    if (userExists) {
      return res
        .status(StatusCode.ClientErrorConflict)
        .json(newStatusMessage(false, "User email already used"));
    }

    await store.UserStore.RegisterUser({
      email,
      name,
      password,
      id: userId
    } as UserWithPassword);
  } catch (err) {
    console.error(err);
    return res
      .status(StatusCode.ServerErrorInternal)
      .json(newStatusMessage(false, "Internal server error"));
  }

  res.status(StatusCode.SuccessCreated).json({
    success: true,
    data: {
      userId
    }
  } as ApiResponse<ApiResponseSignup>);
}
