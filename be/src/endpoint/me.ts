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

import { Response } from "express";
import type { ApiResponse, AuthenticatedRequest } from "../types/Api.js";
import type { User } from "../types/Entities.js";

export default async function meEndpointHandler(
  req: AuthenticatedRequest,
  res: Response
) {
  res.send({ success: true, data: req.user! } as ApiResponse<User>);
}
