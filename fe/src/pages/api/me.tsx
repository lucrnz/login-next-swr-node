import { ApiResponseOrError, ApiStatusMessage } from "@/types/Api";
import { User } from "@/types/User";
import type { NextApiRequest, NextApiResponse } from "next";
import StatusCode from "status-code-enum";

type MeApiResponse = ApiResponseOrError<{
  user: User;
}>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MeApiResponse>
) {
  if (req.method !== "GET") {
    res
      .status(StatusCode.ClientErrorBadRequest)
      .send({ success: false, message: "Bad request" });
  }

  try {
    const apiResponse = await fetch("http://localhost:3002/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.cookies["token"] ? `token=${req.cookies["token"]}` : ""
      },
      credentials: "include"
    });

    const data = (await apiResponse.json()) as MeApiResponse;
    res.status(apiResponse.status).json(data);
  } catch (e) {
    res
      .status(StatusCode.ServerErrorInternal)
      .json({ message: "Internal server error", success: false });
  }
}
