import * as https from "https";
import * as http from "http";

const BASE_URL = "https://www.bakeoff.ink/api/agent";

interface RequestOptions {
  method?: string;
  path: string;
  body?: Record<string, unknown>;
  query?: Record<string, string | number | boolean | undefined>;
  apiKey?: string;
}

export interface ApiError {
  error: string;
  details?: string[];
}

function buildUrl(
  basePath: string,
  query?: Record<string, string | number | boolean | undefined>
): string {
  let url = basePath;
  if (query) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        params.set(key, String(value));
      }
    }
    const qs = params.toString();
    if (qs) url += "?" + qs;
  }
  return url;
}

export function request<T>(options: RequestOptions): Promise<T> {
  return new Promise((resolve, reject) => {
    const fullPath = buildUrl(
      BASE_URL.replace("https://www.bakeoff.ink", "") + options.path,
      options.query
    );

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (options.apiKey) {
      headers["Authorization"] = `Bearer ${options.apiKey}`;
    }

    const body = options.body ? JSON.stringify(options.body) : undefined;
    if (body) {
      headers["Content-Length"] = Buffer.byteLength(body).toString();
    }

    const req = https.request(
      {
        hostname: "www.bakeoff.ink",
        port: 443,
        path: fullPath,
        method: options.method || "GET",
        headers,
      },
      (res: http.IncomingMessage) => {
        let data = "";
        res.on("data", (chunk: Buffer) => {
          data += chunk.toString();
        });
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            if (res.statusCode && res.statusCode >= 400) {
              const err = parsed as ApiError;
              reject(
                new Error(
                  err.error +
                    (err.details ? "\n" + err.details.join("\n") : "")
                )
              );
            } else {
              resolve(parsed as T);
            }
          } catch {
            reject(new Error(`Unexpected response: ${data}`));
          }
        });
      }
    );

    req.on("error", reject);

    if (body) {
      req.write(body);
    }
    req.end();
  });
}
