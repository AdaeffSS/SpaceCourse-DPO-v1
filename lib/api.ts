const API_URL =
    process.env.NEXT_PUBLIC_API_URL;

function getToken() {
    if (
        typeof document ===
        "undefined"
    ) {
        return null;
    }

    return document.cookie
        .split("; ")
        .find((row) =>
            row.startsWith(
                "token="
            )
        )
        ?.split("=")[1];
}

export async function api<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {
    const token =
        getToken();

    const headers =
        new Headers(
            options.headers
        );

    if (
        !(
            options.body instanceof
            FormData
        ) &&
        !headers.has(
            "Content-Type"
        )
    ) {
        headers.set(
            "Content-Type",
            "application/json"
        );
    }

    if (token) {
        headers.set(
            "Authorization",
            `Bearer ${token}`
        );
    }

    const res = await fetch(
        `${API_URL}${url}`,
        {
            ...options,

            headers,

            credentials:
                "include",
        }
    );

    if (!res.ok) {
        const error =
            await res
                .json()
                .catch(() => ({}));

        throw new Error(
            error.message ||
            "Request failed"
        );
    }

    return res.json();
}