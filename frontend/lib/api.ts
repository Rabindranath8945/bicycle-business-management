// frontend/lib/api.ts
export const API_BASE = "https://mandal-cycle-pos-api.onrender.com";

export async function fetcher(path: string, opts: RequestInit = {}) {
  const res = await fetch(API_BASE + path, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...opts,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "API error");
  }
  return res.json();
}
