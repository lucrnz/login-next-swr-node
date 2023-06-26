import type { NextApiRequest } from "next";

function nextCookiesToHeaderString(cookies: NextApiRequest["cookies"]) {
  const cookieString = Object.entries(cookies)
    .map(([key, value]) => `${key}=${value}`)
    .join("; ");

  return cookieString;
}

type FetchBackendOptions<T> = {
  url: string;
  config?: RequestInit;
  cookies?: NextApiRequest["cookies"];
  params?: { [key: string]: string };
  body?: T;
  method?: NextApiRequest["method"];
};

const backendUrl = "http://localhost:3002";

export async function fetchBackend<T>({
  url,
  config,
  cookies,
  params,
  body,
  method
}: FetchBackendOptions<T>) {
  const urlObj = new URL(`${backendUrl}/${url}`);

  if (params && Object.keys(params).length > 0) {
    for (const key of Object.keys(params)) {
      urlObj.searchParams.append(key, params[key]);
    }
  }

  const defaultConfig: RequestInit = {
    method: method ?? "GET",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  };

  let requestInit: RequestInit = defaultConfig;

  if (config) {
    requestInit = {
      ...defaultConfig,
      ...config,
      headers: {
        ...defaultConfig.headers,
        ...config.headers
      }
    };
  }

  if (cookies) {
    requestInit.headers = {
      ...requestInit.headers,
      Cookie: nextCookiesToHeaderString(cookies)
    };
  }

  if (body) {
    requestInit.body = JSON.stringify(body);
  }

  return await fetch(urlObj, requestInit);
}
