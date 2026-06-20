"use client"

import Link from "next/link";
import {
    BookOpen,
    FileText,
    GraduationCap, LogOutIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {parseJWT} from "@/lib/parse-jwt";
import {useEffect, useState} from "react";

const menuItems = [
    {
        title: "Программы",
        href: "/",
        icon: GraduationCap,
    },
    {
        title: "Профили обучающихся",
        href: "/profiles",
        icon: BookOpen,
    },
    // {
    //     title: "Документы",
    //     href: "/documents",
    //     icon: FileText,
    // }
];

export function Sidebar() {

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];

        const payload = token ? parseJWT(token) : null;

        setIsAdmin(
            payload?.roles?.includes("ADMIN") ?? false
        );
    }, []);

    return (
        <aside className="flex h-screen w-72 flex-col border-r border-zinc-200 bg-white">
            <div className="border-b border-zinc-200 p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                        <BookOpen size={20} />
                    </div>

                    <div>
                        <h1 className="font-semibold text-zinc-900">
                            SPC ДПО
                        </h1>

                        <p className="text-sm text-zinc-500">
                            Личный кабинет
                        </p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4">
                <div className="space-y-1">
                    {isAdmin && (
                        <Link
                            href="/admin"
                            className="
                    flex items-center gap-3
                    rounded-xl
                    px-4 py-3
                    text-sm font-medium
                    text-blue-700
                    transition-all
                    hover:bg-blue-50
                "
                        >
                            <GraduationCap size={18} />
                            Админ-панель
                        </Link>
                    )}
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="
                  flex items-center gap-3
                  rounded-xl
                  px-4 py-3
                  text-sm font-medium
                  text-zinc-700
                  transition-all
                  hover:bg-zinc-100
                "
                            >
                                <Icon size={18} />
                                {item.title}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="font-medium text-zinc-900">
                    Иван Иванов
                </p>
                <LogoutButton/>
                <div className="mt-2 flex gap-2">
                </div>
            </div>
        </aside>
    );
}

export function LogoutButton() {
    const router = useRouter();

    const handleLogout = () => {
        document.cookie =
            "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

        router.push("/auth/login");
        router.refresh();
    };

    return (
        <button
            onClick={handleLogout}
            className="
                flex items-center gap-3
                rounded-xl
                px-4 py-3 flex-1
                text-sm font-medium
                text-zinc-700
                transition-all
                hover:bg-red-50
                hover:text-red-600
            "
        >
            <LogOutIcon size={18} />
            Выйти
        </button>
    );
}