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
import customFetch from "@/utils/customFetch";

const verifyUrl = enableCaptcha ? "https://hcaptcha.com/siteverify" : "";
const secretKey = enableCaptcha ? process.env["HCAPTCHA_SECRET"]! : "";

type CaptchaProviderResponse = {
  success: boolean;
  ["error-codes"]?: string[];
};

/**
 * This function is for the Next backend only!
 * Do not reference it to the front-end.
 */
export default async function verifyCaptcha(token: string) {
  if (!enableCaptcha) {
    return true;
  }

  if (token.length === 0) {
    return false;
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

  return Boolean(response.ok && response.data.success);
}
