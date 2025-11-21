export const API_BASE = "https://mandal-cycle-pos-api.onrender.com";

export async function fetcher(path: string, opts: RequestInit = {}) {
  const cleanPath = path.startsWith("/") ? path : "/" + path;

  const headers: Record<string, string> = {};
  if (opts.method && opts.method !== "GET") {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(API_BASE + cleanPath, {
    credentials: "include",
    ...opts,
    headers: {
      ...headers,
      ...(opts.headers || {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "API error");
  }

  return res.json();
}
