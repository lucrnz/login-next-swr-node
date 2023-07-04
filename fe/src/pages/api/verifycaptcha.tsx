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
