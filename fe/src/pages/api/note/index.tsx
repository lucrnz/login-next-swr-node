import { ApiResponseOrMessage } from "@/types/Api";
import { Note } from "@/types/Note";
import forwardRequestToBackend from "@/utils/forwardRequestToBackend";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseOrMessage<Note>>
) {
  return await forwardRequestToBackend({
    req,
    res,
    url: "note",
    validMethod: ["POST"]
  });
}
