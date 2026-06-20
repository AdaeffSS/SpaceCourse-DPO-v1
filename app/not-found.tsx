import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
            <div className="text-center">
                <div className="text-7xl font-bold text-zinc-900">
                    404
                </div>

                <h1 className="mt-5 text-3xl font-semibold text-zinc-950">
                    Страница не найдена
                </h1>

                <p className="mt-3 text-zinc-600">
                    Возможно, страница была удалена или адрес указан неверно.
                </p>

                <Button
                    asChild
                    className="mt-6 h-11 rounded-xl px-5"
                >
                    <Link href="/">
                        Вернуться к программам
                    </Link>
                </Button>
            </div>
        </div>
    );
}