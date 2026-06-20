"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

export function RegisterForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (password !== confirm) {
            setError("Пароли не совпадают");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await api("/auth/register", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });

            router.push("/auth/login");
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

            <div>
                <label className="text-sm font-medium text-zinc-900">
                    Подтверждение пароля
                </label>

                <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
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
                {loading ? "Создание..." : "Создать аккаунт"}
            </Button>

            <div className="text-center text-sm text-zinc-600">
                Уже есть аккаунт?{" "}
                <Link
                    href="/auth/login"
                    className="font-medium text-blue-600 hover:text-blue-700"
                >
                    Войти
                </Link>
            </div>
        </form>
    );
}