import { ApiStatusMessage } from "@/types/Api";
import { UserWithPassword } from "@/types/User";
import { fetchBackend } from "@/utils/fetchBackend";
import type { NextApiRequest, NextApiResponse } from "next";
import StatusCode from "status-code-enum";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiStatusMessage>
) {
  if (req.method !== "POST" || !req.body) {
    res
      .status(StatusCode.ClientErrorBadRequest)
      .send({ success: false, message: "Bad request" });
  }

  try {
    const apiResponse = await fetchBackend("login", {
      method: "POST",
      body: JSON.stringify({ ...(req.body as Partial<UserWithPassword>) })
    });

    if (apiResponse.ok) {
      const cookies = apiResponse.headers.get("set-cookie");

      if (apiResponse.ok && cookies) {
        console.log("[next] setting cookies");
        res.setHeader("set-cookie", cookies);
      }
    }

    const data = (await apiResponse.json()) as ApiStatusMessage;
    res.setHeader("cache-control", "no-cache");
    res.status(apiResponse.status).json(data);
  } catch (e) {
    res.setHeader("cache-control", "no-cache");
    res
      .status(StatusCode.ServerErrorInternal)
      .json({ message: "Internal server error", success: false });
  }
}
