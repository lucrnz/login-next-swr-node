import { ApiStatusMessage } from "@/types/Api";
import { UserWithPassword } from "@/types/User";
import type { NextApiRequest, NextApiResponse } from 'next'
import StatusCode from "status-code-enum";


export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiStatusMessage>) {
  if (req.method !== 'POST' || !req.body) {
    res.status(StatusCode.ClientErrorBadRequest).send({ success: false, message: "Bad request" });
  }

  try {
    const { username, password } = req.body as Partial<UserWithPassword>;

    const apiResponse = await fetch('http://localhost:3002/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
      credentials: 'include',
    });

    if (apiResponse.ok) {
      const cookies = apiResponse.headers.get('set-cookie');

      if (apiResponse.ok && cookies) {
        console.log("[next] setting cookies");
        res.setHeader('set-cookie', cookies);
      }
    }

    const data = await apiResponse.json() as ApiStatusMessage;
    res.status(apiResponse.status).json(data);
  }
  catch (e) {
    res.status(StatusCode.ServerErrorInternal).json({ message: "Internal server error", success: false });
  }
}