import { parseJWT } from "./parse-jwt";

export function getUserFromCookie() {
    if (typeof document === "undefined") {
        return null;
    }

    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

    if (!token) {
        return null;
    }

    return parseJWT(token);
}