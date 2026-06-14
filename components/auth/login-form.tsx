"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export function LoginForm() {
    return (
        <form className="space-y-5">
            <div>
                <label className="text-sm font-medium text-zinc-900">
                    Email
                </label>

                <input
                    type="email"
                    placeholder="example@mail.ru"
                    className="mt-2 h-11 w-full rounded-xl border border-zinc-200 px-4 outline-none transition focus:border-zinc-900"
                />
            </div>

            <div>
                <label className="text-sm font-medium text-zinc-900">
                    Пароль
                </label>

                <input
                    type="password"
                    placeholder="Введите пароль"
                    className="mt-2 h-11 w-full rounded-xl border border-zinc-200 px-4 outline-none transition focus:border-zinc-900"
                />
            </div>

            <Button className="h-11 w-full rounded-xl">
                Войти
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