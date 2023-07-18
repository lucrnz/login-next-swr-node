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

import { enableCaptcha } from "@/config";
import { ApiResponse, ApiStatusMessage } from "@/types/Api";
import customFetch from "@/utils/customFetch";
import type { NextApiRequest, NextApiResponse } from "next";
import { StatusCode } from "status-code-enum";

const verifyUrl = enableCaptcha ? "https://hcaptcha.com/siteverify" : "";
const secretKey = enableCaptcha ? process.env["HCAPTCHA_SECRET"]! : "";

type CaptchaProviderResponse = {
  success: boolean;
  ["error-codes"]?: string[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ApiStatusMessage>>
) {
  if (req.method !== "POST") {
    return res.status(StatusCode.ClientErrorBadRequest).json({
      success: false,
      data: {
        message: "Invalid method"
      }
    });
  }

  if (!enableCaptcha) {
    return res.status(StatusCode.SuccessOK).json({
      success: true,
      data: {
        message: "Ok"
      }
    });
  }

  try {
    const token: string | undefined = req.body["token"];

    if (token === undefined || token.length === 0) {
      return res.status(StatusCode.ClientErrorBadRequest).json({
        success: false,
        data: {
          message: "Bad request"
        }
      });
    }

    const body = {
      secret: secretKey,
      response: token
    };

    const response = await customFetch<CaptchaProviderResponse, typeof body>({
      method: "POST",
      url: verifyUrl,
      body,
      urlEncoded: true
    });

    console.log(response);

    const success = response.ok && response.data.success;

    return res
      .status(success ? StatusCode.SuccessOK : StatusCode.ClientErrorImATeapot)
      .json({
        success,
        data: {
          message: success ? "Ok" : "Error"
        }
      });
  } catch (err) {
    console.error(err);

    return res.status(StatusCode.ServerErrorInternal).json({
      success: false,
      data: {
        message: "Internal server error"
      }
    });
  }
}
