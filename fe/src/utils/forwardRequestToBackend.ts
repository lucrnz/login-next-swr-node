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

import {
  ApiResponse,
  ApiResponseOrMessage,
  ApiStatusMessage
} from "@/types/Api";
import type { NextApiRequest, NextApiResponse } from "next";
import StatusCode from "status-code-enum";
import fetchBackend from "./fetchBackend";
import { CustomFetchResult } from "./customFetch";
import { enableCaptcha } from "@/config";
import verifyCaptcha from "./verifyCaptcha";

type ForwardRequestToBackendOptions<T> = {
  req: NextApiRequest;
  res: NextApiResponse<ApiResponseOrMessage<T>>;
  validMethod: NextApiRequest["method"] | NextApiRequest["method"][];
  url: string;
  cacheControl?: string;
  params?: { [key: string]: string };
  checkCaptcha?: boolean;
  onResponseFetch?: (
    req: NextApiRequest,
    res: NextApiResponse<ApiResponseOrMessage<T>>,
    apiResponse: CustomFetchResult<ApiResponseOrMessage<T>>
  ) => Promise<unknown>;
};

export default async function forwardRequestToBackend<T>({
  req,
  res,
  validMethod,
  url,
  cacheControl,
  params,
  checkCaptcha,
  onResponseFetch
}: ForwardRequestToBackendOptions<T>) {
  const isMethodValid = Array.isArray(validMethod)
    ? validMethod.includes(req.method)
    : req.method === validMethod;

  if (!isMethodValid) {
    res
      .status(StatusCode.ClientErrorBadRequest)
      .send({ success: false, data: { message: "Bad request" } });
  }

  const shouldCheckCaptcha = enableCaptcha && Boolean(checkCaptcha);
  let validCaptcha = !shouldCheckCaptcha;

  if (shouldCheckCaptcha) {
    const captchaToken = req.headers["captcha-token"] as string;
    validCaptcha = await verifyCaptcha(captchaToken);
  }

  if (!validCaptcha) {
    return res.status(StatusCode.ClientErrorBadRequest).send({
      success: false,
      data: { message: "Invalid captcha, please try again." }
    });
  }

  try {
    const apiResponse = await fetchBackend<
      ApiResponse<T> | ApiResponse<ApiStatusMessage>,
      any
    >({
      url: url,
      method: req.method,
      body:
        req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
      cookies: req.cookies,
      params
    });

    if (onResponseFetch) {
      await onResponseFetch(req, res, apiResponse);
    }

    const { data, status } = apiResponse;

    if (cacheControl) {
      res.setHeader("cache-control", cacheControl);
    }

    res.status(status).json(data);
  } catch (e) {
    console.error("forwardRequestToBackend", e);

    if (cacheControl) {
      res.setHeader("cache-control", cacheControl);
    }

    res
      .status(StatusCode.ServerErrorInternal)
      .json({ success: false, data: { message: "Internal server error" } });
  }
}
