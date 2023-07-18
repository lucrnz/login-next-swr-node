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

import { ApiResponseOrMessage } from "@/types/Api";
import { Note } from "@/types/Entities";
import forwardRequestToBackend from "@/utils/forwardRequestToBackend";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseOrMessage<Note>>
) {
  const query = req.query;
  const { id } = query;

  return await forwardRequestToBackend({
    req,
    res,
    url: "note",
    validMethod: ["GET", "POST", "DELETE"],
    params: {
      id: id ? (id as string) : ""
    }
  });
}
