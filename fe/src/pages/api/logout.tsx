import { ApiStatusMessage } from "@/types/Api";
import type { NextApiRequest, NextApiResponse } from 'next'
import StatusCode from "status-code-enum";

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiStatusMessage>) {
  if (req.method !== 'POST') {
    res.status(StatusCode.ClientErrorBadRequest).send({ success: false, message: "Bad request" });
  }

  try {
    const apiResponse = await fetch('http://localhost:3002/logout', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.cookies['token'] ? `token=${req.cookies['token']}` : ''
      },
      credentials: 'include',
    });

    if (apiResponse.ok) {
      res.setHeader('set-cookie', 'token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT');
    }

    res.status(apiResponse.status).json({ success: true, message: "Logged out" });
  }
  catch (e) {
    res.status(StatusCode.ServerErrorInternal).json({ message: "Internal server error", success: false });
  }
}
