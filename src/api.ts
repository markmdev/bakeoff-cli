import { getApiKey } from "./config.js";

const BASE_URL = "https://www.bakeoff.ink/api/agent";

interface RequestOptions {
  method?: string;
  body?: Record<string, unknown>;
  params?: Record<string, string>;
}

export async function api<T = any>(
  endpoint: string,
  opts: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, params } = opts;
  const apiKey = getApiKey();

  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const qs = new URLSearchParams(params).toString();
    url += `?${qs}`;
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
  };

  const fetchOpts: RequestInit = { method, headers };

  if (body) {
    headers["Content-Type"] = "application/json";
    fetchOpts.body = JSON.stringify(body);
  }

  const res = await fetch(url, fetchOpts);
  const data = await res.json();

  if (!res.ok) {
    const msg = (data as any).error || `HTTP ${res.status}`;
    const details = (data as any).details;
    let errMsg = `Error: ${msg}`;
    if (details && Array.isArray(details) && details.length > 0) {
      errMsg += `\n  ${details.join("\n  ")}`;
    }
    throw new Error(errMsg);
  }

  return data as T;
}
