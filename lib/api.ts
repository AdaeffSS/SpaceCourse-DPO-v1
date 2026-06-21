const API_URL = process.env.NEXT_PUBLIC_API_URL!;

let refreshPromise: Promise<string | null> | null = null;

function getToken() {
  if (typeof document === "undefined") return null;

  return document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
}

export function setToken(token: string) {
  document.cookie = `token=${token}; path=/; max-age=86400`;
}

function clearToken() {
  document.cookie = "token=; path=/; max-age=0";
}

export async function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      clearToken();
      return null;
    }

    const data: { accessToken: string } = await res.json();

    setToken(data.accessToken);

    return data.accessToken;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

export async function logout() {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch {}

  clearToken();

  if (typeof window !== "undefined") {
    window.location.href = "/auth/login";
  }
}

export async function api<T>(
    url: string,
    options: RequestInit = {},
): Promise<T> {
  async function execute(accessToken?: string) {
    const headers = new Headers(options.headers);

    if (!(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return fetch(`${API_URL}${url}`, {
      ...options,
      headers,
      credentials: "include",
    });
  }

  let token = getToken();
  let res = await execute(token ?? undefined);

  // =========================
  // 🔥 FIX КЛЮЧЕВОЙ ЛОГИКИ
  // =========================
  if (res.status === 401) {
    const newToken = await refreshAccessToken();

    if (!newToken) {
      // ❗ только здесь logout (как ты и хочешь)
      await logout();
      throw new Error("Unauthorized");
    }

    res = await execute(newToken);
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));

    let message = "Request failed";

    if (typeof error.message === "string") {
      message = error.message;
    } else if (Array.isArray(error.message)) {
      message = error.message.join(", ");
    }

    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;

  return res.json();
}