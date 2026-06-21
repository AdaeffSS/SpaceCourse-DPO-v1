"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";

import { UserCard } from "./user-card";
import { BaseSidebarProps } from "./types";

export function BaseSidebar({
                                subtitle,
                                items,
                                switchLink,
                            }: BaseSidebarProps) {
    const SwitchIcon =
        switchLink?.icon;

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
                            {subtitle}
                        </p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4">
                <div className="space-y-1">
                    {switchLink &&
                        SwitchIcon && (
                            <Link
                                href={
                                    switchLink.href
                                }
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
                                <SwitchIcon
                                    size={18}
                                />
                                {
                                    switchLink.title
                                }
                            </Link>
                        )}

                    {items.map(
                        (item) => {
                            const Icon =
                                item.icon;

                            return (
                                <Link
                                    key={
                                        item.href
                                    }
                                    href={
                                        item.href
                                    }
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
                                    {
                                        item.title
                                    }
                                </Link>
                            );
                        },
                    )}
                </div>
            </nav>

            <UserCard />
        </aside>
    );
}