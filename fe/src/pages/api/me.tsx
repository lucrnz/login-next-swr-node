import { ApiResponseOrMessage } from "@/types/Api";
import { User } from "@/types/User";
import forwardRequestToBackend from "@/utils/forwardRequestToBackend";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    ApiResponseOrMessage<{
      user: User;
    }>
  >
) {
  return await forwardRequestToBackend({
    req,
    res,
    validMethod: "GET",
    url: "me"
  });
}
