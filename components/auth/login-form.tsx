"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

function parseJWT(token: string) {
    try {
        const payload = token.split(".")[1];
        return JSON.parse(atob(payload));
    } catch {
        return null;
    }
}

export function LoginForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await api<{ accessToken: string }>("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });

            document.cookie = `token=${res.accessToken}; path=/; max-age=86400`;

            const payload = parseJWT(res.accessToken);
            const roles: string[] = payload?.roles || [];

            if (roles.includes("ADMIN")) {
                router.push("/admin");
            } else {
                router.push("/");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className="space-y-5" onSubmit={onSubmit}>
            <div>
                <label className="text-sm font-medium text-zinc-900">
                    Email
                </label>

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-zinc-200 px-4 outline-none transition focus:border-zinc-900"
                />
            </div>

            <div>
                <label className="text-sm font-medium text-zinc-900">
                    Пароль
                </label>

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-zinc-200 px-4 outline-none transition focus:border-zinc-900"
                />
            </div>

            {error && (
                <div className="text-sm text-red-600">
                    {error}
                </div>
            )}

            <Button
                type="submit"
                className="h-11 w-full rounded-xl"
                disabled={loading}
            >
                {loading ? "Входим..." : "Войти"}
            </Button>

            <div className="text-center text-sm text-zinc-600">
                Нет аккаунта?{" "}
                <Link
                    href="/auth/register"
                    className="font-medium text-blue-600 hover:text-blue-700"
                >
                    Зарегистрироваться
                </Link>
            </div>
        </form>
    );
}