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

import type { Request, Response } from "express";
import type { ApiResponse, ApiStatusMessage } from "../types/Api.js";

export default async function logoutEndpointHandler(
  req: Request,
  res: Response
) {
  if (req.cookies.token) {
    res.clearCookie("token");
  }
  res.setHeader("cache-control", "no-cache");
  res.send({
    success: true,
    data: { message: "Logged out" }
  } as ApiResponse<ApiStatusMessage>);
}
