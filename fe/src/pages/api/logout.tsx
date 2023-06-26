import { ApiStatusMessage } from "@/types/Api";
import { fetchBackend } from "@/utils/fetchBackend";
import type { NextApiRequest, NextApiResponse } from "next";
import StatusCode from "status-code-enum";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiStatusMessage>
) {
  if (req.method !== "POST") {
    res
      .status(StatusCode.ClientErrorBadRequest)
      .send({ success: false, message: "Bad request" });
  }

  try {
    const apiResponse = await fetchBackend(
      "logout",
      {
        method: "POST"
      },
      req.cookies
    );

    if (apiResponse.ok) {
      res.setHeader(
        "set-cookie",
        "token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      );
    }

    res.setHeader("cache-control", "no-cache");
    res
      .status(apiResponse.status)
      .json({ success: true, message: "Logged out" });
  } catch (e) {
    res
      .status(StatusCode.ServerErrorInternal)
      .json({ message: "Internal server error", success: false });
  }
}
