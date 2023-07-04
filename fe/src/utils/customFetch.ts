import { NextApiRequest } from "next";

function cookiesToHeaderString(cookies: NextApiRequest["cookies"]) {
  const cookieString = Object.entries(cookies)
    .map(([key, value]) => `${key}=${value}`)
    .join("; ");

  return cookieString;
}

function urlEncodeObject(data: { [key: string]: any }): string {
  return Object.entries(data)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
}

function isAbsoluteURL(url: string): boolean {
  return /^[a-z][a-z0-9+.-]*:/.test(url);
}

export type CustomFetchOptions<RequestBodyType> = {
  url: URL | string;
  config?: RequestInit;
  cookies?: NextApiRequest["cookies"];
  params?: { [key: string]: string };
  body?: RequestBodyType;
  method?: NextApiRequest["method"];
  urlEncoded?: boolean;
};

export type CustomFetchResult<ResultType> = {
  status: Response["status"];
  headers: Response["headers"];
  ok: Response["ok"];
  data: ResultType;
};

export default async function customFetch<ResultType, RequestBodyType>({
  url,
  config,
  cookies,
  params,
  body,
  method,
  urlEncoded: providedUrlEncoded
}: CustomFetchOptions<RequestBodyType>) {
  const urlEncoded = providedUrlEncoded ? providedUrlEncoded : false;
  try {
    const urlObj =
      url instanceof URL || isAbsoluteURL(url)
        ? new URL(url.toString())
        : new URL(
            url.toString(),
            typeof window === "undefined" ? undefined : window.location.href
          );

    if (params && Object.keys(params).length > 0) {
      for (const key of Object.keys(params)) {
        urlObj.searchParams.append(key, params[key]);
      }
    }

    const defaultConfig: RequestInit = {
      method: method ?? "GET",
      headers: {
        "Content-Type": urlEncoded
          ? "application/x-www-form-urlencoded"
          : "application/json"
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
        Cookie: cookiesToHeaderString(cookies)
      };
    }

    if (body) {
      requestInit.body = urlEncoded
        ? urlEncodeObject(body)
        : JSON.stringify(body);
    }

    const fetchResponse = await fetch(urlObj, requestInit);
    const { headers, ok, status } = fetchResponse;

    const dataAsText = await fetchResponse.text();

    // @TODO: Check for content-type

    const data = JSON.parse(dataAsText) as ResultType;

    return {
      headers,
      ok,
      status,
      data
    } as CustomFetchResult<ResultType>;
  } catch (err) {
    console.error("customFetch", err);

    throw err;
  }
}
