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

import { ApiResponse, ApiStatusMessage } from "@/types/Api";
import forwardRequestToBackend from "@/utils/forwardRequestToBackend";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ApiStatusMessage>>
) {
  return await forwardRequestToBackend({
    req,
    res,
    url: "logout",
    validMethod: "POST",
    cacheControl: "no-cache",
    onResponseFetch: async (_, __, apiResponse) => {
      if (apiResponse.ok) {
        res.setHeader(
          "set-cookie",
          "token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        );
      }
    }
  });
}
