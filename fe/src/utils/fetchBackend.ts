import type { NextApiRequest } from "next";
const backendUrl = "http://localhost:3002";

function nextCookiesToHeaderString(cookies: NextApiRequest["cookies"]) {
  const cookieString = Object.entries(cookies)
    .map(([key, value]) => `${key}=${value}`)
    .join("; ");

  return cookieString;
}

export async function fetchBackend(
  url: string,
  config: RequestInit | null = null,
  cookies: NextApiRequest["cookies"] | null = null
) {
  const defaultConfig: RequestInit = {
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  };

  let requestInit: RequestInit = defaultConfig;

  if (config !== null) {
    requestInit = {
      ...defaultConfig,
      ...config,
      headers: {
        ...defaultConfig.headers,
        ...config.headers
      }
    };
  }

  if (cookies !== null) {
    requestInit.headers = {
      ...requestInit.headers,
      Cookie: nextCookiesToHeaderString(cookies)
    };
  }

  return await fetch(`${backendUrl}/${url}`, requestInit);
}
