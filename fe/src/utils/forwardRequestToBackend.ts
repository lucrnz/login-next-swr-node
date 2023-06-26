import {
  ApiResponse,
  ApiResponseOrMessage,
  ApiStatusMessage
} from "@/types/Api";
import type { NextApiRequest, NextApiResponse } from "next";
import StatusCode from "status-code-enum";
import { fetchBackend } from "./fetchBackend";

type ForwardRequestToBackendOptions<T> = {
  req: NextApiRequest;
  res: NextApiResponse<ApiResponseOrMessage<T>>;
  validMethod: NextApiRequest["method"] | NextApiRequest["method"][];
  url: string;
  cacheControl?: string;
  onResponseFetch?: (
    req: NextApiRequest,
    res: NextApiResponse<ApiResponseOrMessage<T>>,
    apiResponse: Response
  ) => Promise<unknown>;
};

export async function forwardRequestToBackend<T>({
  req,
  res,
  validMethod,
  url,
  cacheControl,
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

  try {
    const apiResponse = await fetchBackend({
      url: url,
      method: req.method,
      body:
        req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
      cookies: req.cookies
    });

    if (onResponseFetch) {
      await onResponseFetch(req, res, apiResponse);
    }

    const data = (await apiResponse.json()) as
      | ApiResponse<T>
      | ApiResponse<ApiStatusMessage>;

    if (cacheControl) {
      res.setHeader("cache-control", cacheControl);
    }

    res.status(apiResponse.status).json(data);
  } catch (e) {
    console.error(e);

    if (cacheControl) {
      res.setHeader("cache-control", cacheControl);
    }

    res
      .status(StatusCode.ServerErrorInternal)
      .json({ success: false, data: { message: "Internal server error" } });
  }
}
