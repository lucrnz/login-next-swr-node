import { ApiStatusMessage } from "@/types/Api";
import type { NextApiRequest, NextApiResponse } from 'next'
import StatusCode from "status-code-enum";


export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiStatusMessage>) {
  if (req.method !== 'GET') {
    res.status(StatusCode.ClientErrorBadRequest).send({ success: false, message: "Bad request" });
  }

  try {
    const apiResponse = await fetch('http://localhost:3002/foo', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.cookies['token'] ? `token=${req.cookies['token']}` : ''
      },
      credentials: 'include',
    });

    const data = await apiResponse.json() as ApiStatusMessage;
    res.status(apiResponse.status).json(data);
  }
  catch (e) {
    res.status(StatusCode.ServerErrorInternal).json({ message: "Internal server error", success: false });
  }
}
