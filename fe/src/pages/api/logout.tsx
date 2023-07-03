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
