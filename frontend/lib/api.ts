function getCsrfToken(): string | null {
  const match = document.cookie.match(/csrftoken=([^;]+)/);
  return match ? match[1] : null;
}

interface ApiOptions extends RequestInit {
  json?: unknown;
}

export async function api(path: string, options: ApiOptions = {}): Promise<Response> {
  const { json, headers: customHeaders, ...rest } = options;
  const headers: Record<string, string> = { ...(customHeaders as Record<string, string>) };
  if (json) { headers["Content-Type"] = "application/json"; }
  const csrfToken = getCsrfToken();
  if (csrfToken) { headers["X-CSRFToken"] = csrfToken; }
  return fetch(`${process.env.API_URL}${path}`, {
    credentials: "include",
    headers,
    body: json ? JSON.stringify(json) : options.body,
    ...rest,
  });
}

export async function apiGet(path: string) { return api(path, { method: "GET" }); }
export async function apiPost(path: string, data?: unknown) { return api(path, { method: "POST", json: data }); }
export async function apiPatch(path: string, data?: unknown) { return api(path, { method: "PATCH", json: data }); }
export async function apiPut(path: string, data?: unknown) { return api(path, { method: "PUT", json: data }); }
export async function apiDelete(path: string) { return api(path, { method: "DELETE" }); }
