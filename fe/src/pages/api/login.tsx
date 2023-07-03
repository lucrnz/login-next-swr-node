import { ApiResponseOrMessage } from "@/types/Api";
import forwardRequestToBackend from "@/utils/forwardRequestToBackend";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseOrMessage<string>>
) {
  return await forwardRequestToBackend({
    req,
    res,
    url: "login",
    validMethod: "POST",
    cacheControl: "no-cache",
    onResponseFetch: async (_, res, apiResponse) => {
      if (apiResponse.ok) {
        const cookies = apiResponse.headers.get("set-cookie");

        if (cookies) {
          console.log("[next] setting cookies");
          res.setHeader("set-cookie", cookies);
        }
      }
    }
  });
}
