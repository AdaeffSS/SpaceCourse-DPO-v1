"use client";

import { LogOutIcon } from "lucide-react";

import { logout } from "@/lib/api";

import { useAuth } from "@/providers/auth-provider";

function getRoleLabel(role: string) {
    switch (role) {
        case "ADMIN":
            return "Админ";

        case "USER":
            return "Пользователь";

        default:
            return role;
    }
}

export function UserCard() {
    const { user } = useAuth();

    return (
        <div className="m-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-zinc-900">
                        {user?.email ?? "Загрузка..."}
                    </p>

                    <p
                        className="
                            mt-1 inline-flex
                            rounded-full
                            bg-blue-100
                            px-2 py-0.5
                            text-xs font-medium
                            text-blue-700
                        "
                    >
                        {user?.roles
                                ?.map(getRoleLabel)
                                .join(", ") ??
                            "Загрузка..."}
                    </p>
                </div>

                <button
                    onClick={logout}
                    className="
                        flex h-11 w-11 shrink-0
                        items-center justify-center
                        rounded-xl
                        border border-zinc-200
                        bg-white
                        text-zinc-600
                        transition-all
                        hover:border-red-200
                        hover:bg-red-50
                        hover:text-red-600
                    "
                >
                    <LogOutIcon size={18} />
                </button>
            </div>
        </div>
    );
}